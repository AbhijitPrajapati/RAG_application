import random
from datetime import datetime, timedelta
from chromadb import PersistentClient

def random_datetime_within_three_months():
    now = datetime.now()
    one_year_ago = now - timedelta(days=90)
    
    # Total seconds between one year ago and now
    delta_seconds = int((now - one_year_ago).total_seconds())
    
    # Generate a random number of seconds to add to the starting time
    random_seconds = random.randint(0, delta_seconds)
    
    return one_year_ago + timedelta(seconds=random_seconds)


db = PersistentClient('backend/data/chroma_db')
db.delete_collection('documents')
db.create_collection('documents')
