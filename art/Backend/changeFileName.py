import os  # import os module

directory = '/home/sandile/ArtProgram/ArtProgram/art/public/art3'  # set directory path

for number, entry in enumerate(os.scandir(directory)):  
    if entry.is_file():  
        print(entry.name)
        old_path = entry.path
        new_name = f"{number}.jpg"
        new_path = os.path.join(directory, new_name)
        
        os.rename(old_path, new_path)
        print(f"Renamed {old_path} to {new_path}")
