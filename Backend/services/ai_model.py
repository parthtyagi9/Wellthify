import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

def calculate_bmi(weight, height, weight_unit, height_unit):
    """Calculates BMI based on weight and height."""
    if weight_unit == "kg" and height_unit == "m":
        bmi = weight / (height * height)
    elif weight_unit == "lbs" and height_unit == "in":
        bmi = (weight / (height * height)) * 703
    else:
        return "Invalid units"
    return bmi

def get_bmi_category(bmi):
    """Determines BMI category."""
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal weight"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"

def generate_nutrition_plan(weight, height, weight_unit, height_unit, wake_up_time, work_start_time, work_end_time, schedule, vegetarian, non_vegetarian, restrictions):
    """Generates a nutrition plan using Gemini."""

    bmi = calculate_bmi(weight, height, weight_unit, height_unit)
    if isinstance(bmi, str):
        return bmi  # Return error message if the BMI calculation failed.

    bmi_category = get_bmi_category(bmi)

    prompt = f"""The user's BMI is {bmi:.2f}, categorized as {bmi_category}. Their wake-up time is {wake_up_time}, work hours are from {work_start_time} to {work_end_time}, and their daily schedule is: {schedule}. They are {vegetarian if vegetarian else ''} {non_vegetarian if non_vegetarian else ''} and have the following dietary restrictions: {restrictions}. Please create a detailed nutrition plan for them from morning to night, with specific meal suggestions and approximate calorie/macronutrient information, that is suited to their BMI and schedule. Generate it in points so that it is easy to read"""

    model = genai.GenerativeModel("models/gemini-1.5-flash")  # or gemini-1.5-pro if you want the smarter one
    response = model.generate_content(prompt)
    return response.text

