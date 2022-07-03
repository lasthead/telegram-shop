from sqlalchemy import BigInteger, create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
 
from orm.configs import DB_URI
 
eng = create_engine (DB_URI)
Base = declarative_base ()

Session = sessionmaker(bind=eng)
session = Session()

class Group(Base):
    __tablename__ = 'users_groups'
    id = Column(BigInteger, primary_key=True, autoincrement=False)
    name = Column(String(80))
    is_active = Column(Boolean, default=False, nullable=False)


class User(Base):
    __tablename__ = 'active_users'
    id = Column(BigInteger, primary_key=True, autoincrement=False)
    group_id = Column(BigInteger, nullable=False)
    username = Column(String(30))
    first_name = Column(String(30))
    last_name = Column(String(30))
    is_bot = Column(Boolean, default=False, nullable=False)


def createTables():
    Base.metadata.drop_all(bind=eng)
    Base.metadata.create_all(bind=eng)