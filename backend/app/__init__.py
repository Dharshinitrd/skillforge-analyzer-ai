import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from app.database import init_db

# Load environment variables
load_dotenv()

def create_app():
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    )
    logger = logging.getLogger(__name__)

    app = Flask(__name__, instance_relative_config=True)
    
    # Configure defaults
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'skillforge-default-key'),
        DATABASE_PATH=os.path.join(app.instance_path, 'database.db')
    )
    
    # Load custom database path if present
    custom_db_path = os.getenv('DATABASE_PATH')
    if custom_db_path:
        # If absolute path, use as-is; otherwise merge with instance/root path
        if os.path.isabs(custom_db_path):
            app.config['DATABASE_PATH'] = custom_db_path
        else:
            app.config['DATABASE_PATH'] = os.path.abspath(custom_db_path)

    # Enable CORS for frontend integration
    # In production, specify frontend domain, else allow all origins for ease of integration
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize SQLite database
    try:
        init_db(app.config['DATABASE_PATH'])
        logger.info(f"Database initialized at: {app.config['DATABASE_PATH']}")
    except Exception as e:
        logger.error(f"Failed to initialize SQLite database: {str(e)}")

    # Register blueprints
    from app.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Health Check
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({"status": "healthy", "service": "SkillForge AI Backend"}), 200

    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app
