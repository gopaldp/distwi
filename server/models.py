from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, validates
from sqlalchemy import Integer, String, Float, TIMESTAMP, ForeignKey , Boolean
from datetime import datetime
from passlib.context import CryptContext
class Base(DeclarativeBase):
    pass

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# class User(Base):
#     __tablename__ = 'users'

#     id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
#     username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
#     email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
#     password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
#     role: Mapped[str] = mapped_column(String(20), default="user", nullable=False)
#     is_active: Mapped[bool] = mapped_column(Boolean, default=True)

#     def verify_password(self, plain_password: str):
#         return pwd_context.verify(plain_password, self.password_hash)

#     def set_password(self, plain_password: str):
#         self.password_hash = pwd_context.hash(plain_password)

class Sensor(Base):
    __tablename__ = 'Sensor'
    name: Mapped[str] = mapped_column(String(128), primary_key=True, nullable=False)
    object_id: Mapped[int] = mapped_column(Integer, nullable=False)
    type_id: Mapped[int] = mapped_column(Integer, nullable=False)

class Channel(Base):
    __tablename__ = 'Channel'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    unit: Mapped[str] = mapped_column(String(128), nullable=True)
    type_id: Mapped[int] = mapped_column(Integer, nullable=False)

class NumericalValue(Base):
    __tablename__ = 'NumericalValue'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    channel_id: Mapped[int] = mapped_column(Integer, nullable=False)
    time: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)
    sensor_name: Mapped[str] = mapped_column(ForeignKey("Sensor.name"))

class NonNumericalValue(Base):
    __tablename__ = 'NonNumericalValue'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    value: Mapped[str] = mapped_column(String(128), nullable=False)
    channel_id: Mapped[int] = mapped_column(Integer, nullable=False)
    time: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)
    sensor_name: Mapped[str] = mapped_column(ForeignKey("Sensor.name"))