import subprocess
from datetime import datetime
import os

def upload_art_collection(art_path, public_dir="public_cids", output_dir="ipfs_cids"):
    """
    Uploads art collection to IPFS and saves:
    - Main collection CID (dated file)
    - All individual CIDs (in public directory)
    """
    try:
        if not os.path.isdir(art_path):
            print(f"Error: Art directory not found - {art_path}")
            return False

        os.makedirs(public_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        result = subprocess.run(
            ['ipfs', 'add', '--pin', '-r', art_path],
            capture_output=True,
            text=True
        )

        output_lines = result.stdout.strip().split('\n')
        
        all_cids_file = f"{public_dir}/all_cids.txt"
        with open(all_cids_file, 'w') as f:
            for line in output_lines:
                if line.strip():
                    parts = line.split()
                    cid = parts[1]  
                    f.write(f"{cid}\n")
        
        main_cid = output_lines[-1].split()[1]
        
        date_str = datetime.now().strftime("%Y-%m-%d")
        main_cid_file = f"{output_dir}/{date_str}_main_cid.txt"
        with open(main_cid_file, 'w') as f:
            f.write(main_cid)

        print(f"\nSuccessfully uploaded art collection!")
        print(f"Main CID saved to: {main_cid_file}")
        print(f"All CIDs saved to: {all_cids_file}")
        print(f"\nAccess main collection at: https://ipfs.io/ipfs/{main_cid}")
        return True

    except Exception as e:
        print(f"Error: {str(e)}")
        return False

# Example usage
upload_art_collection(
    art_path="/home/sandile/ArtProgram/ArtProgram/art/public/art",
    public_dir="public_cids",
    output_dir="ipfs_cids"
)