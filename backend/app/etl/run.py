from app.services.settings import get_settings
from app.etl.runner import run_etl


def main() -> None:
    settings = get_settings()
    result = run_etl(settings)
    print(result)


if __name__ == "__main__":
    main()
