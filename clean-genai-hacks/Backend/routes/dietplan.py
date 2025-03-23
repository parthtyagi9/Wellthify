from flask import Blueprint, request, jsonify
from services.ai_model import generate_nutrition_plan

dietplan_bp = Blueprint('dietplan', __name__)

@dietplan_bp.route('/generate', methods=['POST'])
def generate_plan():
    data = request.get_json()
    if data is None:
        return jsonify({'error': 'Invalid or missing JSON'}), 400
    weight = float(data.get('weight', 0))
    height = float(data.get('height', 0))
    weight_unit = data.get('weightUnit')
    height_unit = data.get('heightUnit')
    wake_up_time = data.get('wakeUpTime')
    work_start_time = data.get('workStartTime')
    work_end_time = data.get('workEndTime')
    schedule = data.get('schedule')
    vegetarian = data.get('vegetarian')
    non_vegetarian = data.get('nonVegetarian')
    restrictions = data.get('restrictions')

    nutrition_plan = generate_nutrition_plan(
        weight,
        height,
        weight_unit,
        height_unit,
        wake_up_time,
        work_start_time,
        work_end_time,
        schedule,
        vegetarian,
        non_vegetarian,
        restrictions
    )

    # Return the nutrition plan as a JSON response
    return jsonify({'nutritionPlan': nutrition_plan})
