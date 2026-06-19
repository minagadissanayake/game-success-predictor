from pydantic import BaseModel
from typing import List

class GameInput(BaseModel):
    primary_genre: str
    genre_count: int
    platform_count: int
    publisher: str = ""
    release_year: int
    playtime: float
    ratings_count: int
    reviews_count: int
    added_status_owned: int

class FactorItem(BaseModel):
    feature: str
    impact: float

class PredictionResponse(BaseModel):
    success_probability: float
    prediction: str
    confidence: str
    top_factors: List[FactorItem]