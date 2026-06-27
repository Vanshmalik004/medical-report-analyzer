import os
from PIL import Image, ImageDraw

def create_mock_report():
    # Create a white image
    width, height = 600, 400
    img = Image.new('RGB', (width, height), color='white')
    d = ImageDraw.Draw(img)
    
    # Add title and text
    text_content = """
    DOOPER DIAGNOSTIC HEALTH LABS
    -------------------------------------------
    PATIENT: Dr. Dooper Tester
    DATE: 2026-06-25
    
    BIOMARKER PANEL:
    - Fasting Blood Glucose: 135 mg/dL
    - Hemoglobin: 9.8 g/dL
    - Vitamin D (25-OH): 15 ng/mL
    - Total Cholesterol: 250 mg/dL
    
    Status: Diagnostic Assessment Pending.
    -------------------------------------------
    """
    
    # Write text to image
    # Note: Using default font since we don't assume TTF paths on macOS
    d.multiline_text((40, 40), text_content, fill='black', spacing=8)
    
    # Save the image
    output_path = os.path.join(os.getcwd(), 'mock-report.png')
    img.save(output_path)
    print(f"Mock report image created successfully at: {output_path}")

if __name__ == '__main__':
    try:
        create_mock_report()
    except Exception as e:
        print(f"Error creating mock image: {e}")
