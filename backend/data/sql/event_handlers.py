from sqlalchemy import text

def update_collection(connection, delta_number_files, collection_id):
    connection.execute(
        text('''
            UPDATE collections
            SET last_modified = CURRENT_TIMESTAMP,
                number_files = number_files + :dnf
            WHERE id = :cid
        '''),
        {'cid': collection_id, 'dnf': delta_number_files}
    )

def file_delete(mapper, connection, target):
    update_collection(connection, -1, target.collection_id)

def file_insert(mapper, connection, target):
    update_collection(connection, 1, target.collection_id)

def collection_rename(mapper, connection, target):
    update_collection(connection, 0, target.id)