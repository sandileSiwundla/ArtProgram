import os

def safe_rename_files(directory):
    temp_dir = os.path.join(directory, 'temp_rename')
    os.makedirs(temp_dir, exist_ok=True)
    
    files = [f for f in os.listdir(directory) if f.lower().endswith('.jpg')]
    files.sort()  
    
    for number, filename in enumerate(files):
        old_path = os.path.join(directory, filename)
        temp_path = os.path.join(temp_dir, f"{number}.jpg")
        
        print(f"Moving {old_path} to temporary {temp_path}")
        os.rename(old_path, temp_path)
    
    for number in range(len(files)):
        temp_path = os.path.join(temp_dir, f"{number}.jpg")
        new_path = os.path.join(directory, f"{number}.jpg")
        
        print(f"Moving {temp_path} to final {new_path}")
        os.rename(temp_path, new_path)
    
    os.rmdir(temp_dir)

directory = '/home/sandile/ArtProgram/ArtProgram/art/public/art3'
safe_rename_files(directory)