#!/usr/bin/env python3
"""
Quick Image Splitter - Simple version
Just run this with your image file
"""

from PIL import Image
import os

def quick_split(image_path):
    """Quick split with default settings"""
    
    # Open image
    img = Image.open(image_path)
    width, height = img.size
    print(f"Image size: {width}x{height}")
    
    # Split points
    mid_x = width // 2
    text_height = int(height * 0.25)  # 25% for text
    door_height = height - text_height
    
    print(f"Splitting at: x={mid_x}, y={door_height}")
    
    # Create data directory
    os.makedirs("data", exist_ok=True)
    
    # Split and save
    img.crop((0, 0, mid_x, door_height)).save("data/left_door.jpeg", "JPEG", quality=95)
    img.crop((mid_x, 0, width, door_height)).save("data/right_door.jpeg", "JPEG", quality=95)
    img.crop((0, door_height, mid_x, height)).save("data/left_bottom_text.jpeg", "JPEG", quality=95)
    img.crop((mid_x, door_height, width, height)).save("data/right_bottom_text.jpeg", "JPEG", quality=95)
    
    print("✅ Done! Files saved to data/ folder")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python quick_split.py <your_image.jpg>")
        sys.exit(1)
    
    quick_split(sys.argv[1])
