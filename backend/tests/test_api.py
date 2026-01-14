import importlib
import os
import shutil
from pathlib import Path

from fastapi.testclient import TestClient


def create_client(tmp_path: Path) -> TestClient:
    data_src = Path(__file__).resolve().parents[2] / "data" / "indicators.csv"
    data_dst = tmp_path / "indicators.csv"
    shutil.copyfile(data_src, data_dst)
    os.environ["DATA_PATH"] = str(data_dst)
    os.environ["DB_PATH"] = str(tmp_path / "app.db")
    import app.main
    importlib.reload(app.main)
    return TestClient(app.main.app)


def test_health(tmp_path: Path):
    client = create_client(tmp_path)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_etl_run(tmp_path: Path):
    client = create_client(tmp_path)
    response = client.post("/etl/run")
    assert response.status_code == 200
    data = response.json()
    assert data["rows_inserted"] > 0


def test_series_filtering(tmp_path: Path):
    client = create_client(tmp_path)
    client.post("/etl/run")
    response = client.get(
        "/series",
        params={
            "indicator": "selic",
            "start": "2016-01-01",
            "end": "2016-12-01",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["indicator"] == "selic"
    assert len(data["data"]) == 12


def test_stats(tmp_path: Path):
    client = create_client(tmp_path)
    client.post("/etl/run")
    response = client.get(
        "/stats",
        params={
            "indicator": "ipca",
            "start": "2018-01-01",
            "end": "2018-12-01",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["indicator"] == "ipca"
    assert "min" in data and "max" in data and "avg" in data
