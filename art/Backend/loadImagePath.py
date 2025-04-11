import os
import json

directory = '/home/sandile/ArtProgram/ArtProgram/art/public/art2'
imagePath = []

entries = sorted(
    [entry for entry in os.scandir(directory) if entry.is_file()],
    key=lambda x: x.name 
)

for number, entry in enumerate(entries, start=1):  
    imagePath.append({
        "imagePath": f"art1/{entry.name}"  
    })

with open("pathfile.json", "w") as f:
    json.dump(imagePath, f, indent=2) 