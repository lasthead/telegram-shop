import requests
import json
import copy
from orm.models import Group, session
from orm.configs import TG_GET_UPDATES_URI 

class Chat(object):
    def __init__(self, id, title=False, type=False, **args):
        self.id = id
        self.type = type
        self.title = title


def getGroupsCollection(array):
    groupCollection = []
    for val in array:
        newObj = {}
        if ("my_chat_member" in val):
            newObj = copy.copy(Chat(**val["my_chat_member"]["chat"]))
        if ("channel_post" in val):
            newObj = copy.copy(Chat(**val["channel_post"]["chat"]))
        if ("message" in val):
            newObj = copy.copy(Chat(**val["message"]["chat"]))
        
        # remove duplicate groups from json response data
        if (len([x.id for x in groupCollection if x.id == newObj.id]) < 1): 
            groupCollection.append(newObj)
            
    return groupCollection


result = requests.get(TG_GET_UPDATES_URI)
resJson = json.loads(result.content)

groupsCollection = getGroupsCollection(resJson["result"])

existGroupsList = list(session.query(Group))


for group in groupsCollection:
    if (len([x.id for x in existGroupsList if x.id == -group.id]) < 1): 
        groupEntity = Group(
            id = -group.id,
            name = group.title
        )
        session.add(groupEntity)

session.commit()
session.close()
