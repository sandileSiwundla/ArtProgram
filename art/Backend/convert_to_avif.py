import os
import subprocess

def convert_to_avif(input_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    for filename in os.listdir(input_dir):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, os.path.splitext(filename)[0] + ".avif")
            command = [
                "avifenc",
                "--min", "25",   # You can tweak quality levels here
                "--max", "35",
                "--speed", "6",  # Range: 0 (slowest/best) to 10 (fastest)
                input_path,
                output_path,
            ]
            subprocess.run(command)

if __name__ == "__main__":
    input_dir = "ArtProgram/art/public/art"
    for dir_name in os.listdir(input_dir):
        dir_path = os.path.join(input_dir, dir_name)
        if os.path.isdir(dir_path):
            output_dir = dir_path + "_avif"
            convert_to_avif(dir_path, output_dir)
