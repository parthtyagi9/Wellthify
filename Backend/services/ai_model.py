from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure your Gemini API key
genai.configure(api_key="AIzaSyANy_OxS3gihvNvsKfVIz0hkqNK7EabRWY")  # Replace with your actual API key

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

    prompt = f"""The user's BMI is {bmi:.2f}, categorized as {bmi_category}. Their wake-up time is {wake_up_time}, work hours are from {work_start_time} to {work_end_time}, and their daily schedule is: {schedule}. They are {vegetarian if vegetarian else ''} {non_vegetarian if non_vegetarian else ''} and have the following dietary restrictions: {restrictions}. Please create a detailed nutrition plan for them from morning to night, with specific meal suggestions and approximate calorie/macronutrient information, that is suited to their BMI and schedule."""

    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text

@app.route('/nutrition_plan', methods=['POST'])
def get_nutrition_plan():
    """API endpoint to generate a nutrition plan."""
    data = request.get_json()

    # Extract user input from JSON request
    weight = data.get('weight')
    height = data.get('height')
    weight_unit = data.get('weightUnit')
    height_unit = data.get('heightUnit')
    wake_up_time = data.get('wakeUpTime')
    work_start_time = data.get('workStartTime')
    work_end_time = data.get('workEndTime')
    schedule = data.get('schedule')
    vegetarian = data.get('vegetarian')
    non_vegetarian = data.get('nonVegetarian')
    restrictions = data.get('restrictions')

    # Generate nutrition plan
    nutrition_plan = generate_nutrition_plan(weight, height, weight_unit, height_unit, wake_up_time, work_start_time, work_end_time, schedule, vegetarian, non_vegetarian, restrictions)

    # Return nutrition plan as JSON response
    return jsonify({'nutritionPlan': nutrition_plan})

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False in production