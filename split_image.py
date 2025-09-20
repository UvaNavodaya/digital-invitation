#!/usr/bin/env python3
"""
Image Splitter for Digital Invitation
Splits a single door image into 4 parts for the invitation layout
"""

from PIL import Image
import os
import sys

def split_door_image(input_path, output_dir="data"):
    """
    Split a door image into 4 parts:
    - left_door.jpeg (top left)
    - right_door.jpeg (top right) 
    - left_bottom_text.jpeg (bottom left)
    - right_bottom_text.jpeg (bottom right)
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Open the image
        img = Image.open(input_path)
        width, height = img.size
        
        print(f"Original image size: {width}x{height}")
        
        # Calculate split points
        # Split horizontally in the middle
        mid_x = width // 2
        
        # For vertical split, you can adjust this ratio
        # This assumes text takes up about 30% of the height from bottom
        text_height = int(height * 0.3)  # Adjust this ratio as needed
        door_height = height - text_height
        
        print(f"Split points:")
        print(f"  Horizontal: {mid_x}px")
        print(f"  Vertical: {door_height}px (door), {text_height}px (text)")
        
        # Split the image
        # Top left (left door)
        left_door = img.crop((0, 0, mid_x, door_height))
        left_door.save(os.path.join(output_dir, "left_door.jpeg"), "JPEG", quality=95)
        
        # Top right (right door)
        right_door = img.crop((mid_x, 0, width, door_height))
        right_door.save(os.path.join(output_dir, "right_door.jpeg"), "JPEG", quality=95)
        
        # Bottom left (left text)
        left_text = img.crop((0, door_height, mid_x, height))
        left_text.save(os.path.join(output_dir, "left_bottom_text.jpeg"), "JPEG", quality=95)
        
        # Bottom right (right text)
        right_text = img.crop((mid_x, door_height, width, height))
        right_text.save(os.path.join(output_dir, "right_bottom_text.jpeg"), "JPEG", quality=95)
        
        print("\n✅ Successfully split image into 4 parts:")
        print(f"  - {output_dir}/left_door.jpeg ({left_door.size[0]}x{left_door.size[1]})")
        print(f"  - {output_dir}/right_door.jpeg ({right_door.size[0]}x{right_door.size[1]})")
        print(f"  - {output_dir}/left_bottom_text.jpeg ({left_text.size[0]}x{left_text.size[1]})")
        print(f"  - {output_dir}/right_bottom_text.jpeg ({right_text.size[0]}x{right_text.size[1]})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def interactive_split(input_path, output_dir="data"):
    """
    Interactive version that lets you adjust the split ratio
    """
    try:
        img = Image.open(input_path)
        width, height = img.size
        
        print(f"Original image size: {width}x{height}")
        print("\nCurrent split settings:")
        print(f"  Horizontal split: {width//2}px (middle)")
        
        # Let user adjust the vertical split ratio
        while True:
            try:
                text_ratio = float(input(f"\nEnter text height ratio (0.1-0.5, default 0.3): ") or "0.3")
                if 0.1 <= text_ratio <= 0.5:
                    break
                else:
                    print("Please enter a value between 0.1 and 0.5")
            except ValueError:
                print("Please enter a valid number")
        
        text_height = int(height * text_ratio)
        door_height = height - text_height
        
        print(f"\nFinal split points:")
        print(f"  Horizontal: {width//2}px")
        print(f"  Vertical: {door_height}px (door), {text_height}px (text)")
        
        # Confirm before splitting
        confirm = input("\nProceed with split? (y/n): ").lower().strip()
        if confirm != 'y':
            print("Split cancelled.")
            return False
        
        return split_door_image(input_path, output_dir)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python split_image.py <input_image> [output_dir]")
        print("  python split_image.py <input_image> --interactive")
        print("\nExample:")
        print("  python split_image.py door.jpg")
        print("  python split_image.py door.jpg --interactive")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_dir = "data"
    
    if len(sys.argv) > 2:
        if sys.argv[2] == "--interactive":
            interactive_split(input_file, output_dir)
        else:
            output_dir = sys.argv[2]
            split_door_image(input_file, output_dir)
    else:
        split_door_image(input_file, output_dir)
