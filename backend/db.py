from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./nids.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    flow_id = Column(String, index=True)
    alert_type = Column(String, index=True)
    severity = Column(String, index=True) # LOW, MEDIUM, HIGH, CRITICAL
    src_ip = Column(String, index=True)
    dst_ip = Column(String, index=True)
    message = Column(String)
    is_acknowledged = Column(Integer, default=0) # SQLite standardizes booleans as int 0/1
    created_at = Column(DateTime, default=datetime.utcnow)

class Flow(Base):
    __tablename__ = "flows"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    src_ip = Column(String, index=True)
    dst_ip = Column(String, index=True)
    src_port = Column(Integer)
    dst_port = Column(Integer)
    protocol = Column(String)
    flow_duration = Column(Float)
    total_bytes = Column(Integer)
    prediction = Column(String)
    confidence = Column(Float)
    severity = Column(String)

Base.metadata.create_all(bind=engine)
