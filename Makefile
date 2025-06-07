run:
	streamlit run main.py

format:
	ruff format .

lint:
	ruff check . --fix