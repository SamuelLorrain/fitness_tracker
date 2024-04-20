from __future__ import annotations
from typing import Annotated, Optional, Self
from fitness.food.exceptions import InvalidAddOperation
from pydantic import BaseModel, Field
from enum import StrEnum

# Be careful, annotated types are not validated at
# runtime unless they are types of as pydantic BaseModel
# To validate them directly,
# see: https://docs.pydantic.dev/latest/concepts/types/#adding-validation-and-serialization
Grams = Annotated[float, Field(ge=0)]
KCal = Annotated[float, Field(ge=0)]
Ui = Annotated[int, Field(ge=0)]

def _safe_add(a: Optional[float], b: Optional[float]) -> Optional[float]:
    """
    Add two optional values, considering None as absorbant value
    """
    if a is not None and b is not None:
        return a + b
    elif a is None and b is not None:
        return b
    elif a is not None and b is None:
        return a
    return None # a is None and b is None


class FoodGroup(StrEnum):
    unknown = 'unknown'
    fruit = 'fruit'
    vegetable = 'vegetable'
    starchy = 'starchy'
    dairy = 'dairy'
    protein = 'protein'
    fat = 'fat'

class ServingSize(BaseModel):
    name: str = "100g"
    grams: Grams = Field(default=100)

class OptionalServingSize(BaseModel):
    name: Optional[str] = None
    grams: Optional[Grams] = None

class Vitamins(BaseModel):
    b1: Optional[Grams] = None
    b2: Optional[Grams] = None
    b3: Optional[Grams] = None
    b5: Optional[Grams] = None
    b6: Optional[Grams] = None
    b12: Optional[Grams] = None
    folate: Optional[Grams] = None
    a: Optional[Grams] = None
    c: Optional[Grams] = None
    d: Optional[Ui] = None
    e: Optional[Grams] = None
    k: Optional[Grams] = None

    def __add__(self, rhs: Vitamins) -> Vitamins:
        return Vitamins(
            b1=_safe_add(self.b1, rhs.b1),
            b2=_safe_add(self.b2, rhs.b2),
            b3=_safe_add(self.b3, rhs.b3),
            b5=_safe_add(self.b5, rhs.b5),
            b6=_safe_add(self.b6, rhs.b6),
            b12=_safe_add(self.b12, rhs.b12),
            folate=_safe_add(self.folate, rhs.folate),
            a=_safe_add(self.a, rhs.a),
            c=_safe_add(self.c, rhs.c),
            d=_safe_add(self.d, rhs.d),
            e=_safe_add(self.e, rhs.e),
            k=_safe_add(self.k, rhs.k),
        )


class Minerals(BaseModel):
    calcium: Optional[Grams] = None
    copper: Optional[Grams] = None
    iron: Optional[Grams] = None
    magnesium: Optional[Grams] = None
    manganese: Optional[Grams] = None
    phosphorus: Optional[Grams] = None
    potassium: Optional[Grams] = None
    selenium: Optional[Grams] = None
    sodium: Optional[Grams] = None
    zinc: Optional[Grams] = None

    def __add__(self, rhs: Minerals) -> Minerals:
        return Minerals(
            calcium=_safe_add(self.calcium, rhs.calcium),
            copper=_safe_add(self.copper, rhs.copper),
            iron=_safe_add(self.iron, rhs.iron),
            magnesium=_safe_add(self.magnesium, rhs.magnesium),
            manganese=_safe_add(self.manganese, rhs.manganese),
            phosphorus=_safe_add(self.phosphorus, rhs.phosphorus),
            potassium=_safe_add(self.potassium, rhs.potassium),
            selenium=_safe_add(self.selenium, rhs.selenium),
            sodium=_safe_add(self.sodium, rhs.sodium),
            zinc=_safe_add(self.zinc, rhs.zinc),
        )

class Carbohydrates(BaseModel):
    carbs: Optional[Grams] = None
    fiber: Optional[Grams] = None
    starch: Optional[Grams] = None
    sugars: Optional[Grams] = None
    added_sugars: Optional[Grams] = None

    def __add__(self, rhs: Carbohydrates) -> Carbohydrates:
        return Carbohydrates(
            carbs=_safe_add(self.carbs, rhs.carbs),
            fiber=_safe_add(self.fiber, rhs.fiber),
            starch=_safe_add(self.starch, rhs.starch),
            sugars=_safe_add(self.sugars, rhs.sugars),
            added_sugars=_safe_add(self.added_sugars, rhs.added_sugars),
        )

    # TODO not sure about the type here
    def net_carbs(self) -> float:
        carbs_value = float(self.carbs) if self.carbs is not None else 0
        fiber_value = float(self.fiber) if self.fiber is not None else 0
        return max(carbs_value - fiber_value, 0)

class Lipids(BaseModel):
    cholesterol: Optional[Grams] = None
    fat: Optional[Grams] = None
    monounsatured: Optional[Grams] = None
    polyunsatured: Optional[Grams] = None
    omega3: Optional[Grams] = None
    omega6: Optional[Grams] = None
    saturated: Optional[Grams] = None
    trans_fats: Optional[Grams] = None

    def __add__(self, rhs: Lipids) -> Lipids:
        return Lipids(
            cholesterol=_safe_add(self.cholesterol, rhs.cholesterol),
            fat=_safe_add(self.fat, rhs.fat),
            monounsatured=_safe_add(self.monounsatured, rhs.monounsatured),
            polyunsatured=_safe_add(self.polyunsatured, rhs.polyunsatured),
            omega3=_safe_add(self.omega3, rhs.omega3),
            omega6=_safe_add(self.omega6, rhs.omega6),
            saturated=_safe_add(self.saturated, rhs.saturated),
            trans_fats=_safe_add(self.trans_fats, rhs.trans_fats),
        )

class Proteins(BaseModel):
    protein: Optional[Grams] = None
    cystine: Optional[Grams] = None
    histidine: Optional[Grams] = None
    isoleucine: Optional[Grams] = None
    leucine: Optional[Grams] = None
    lysine: Optional[Grams] = None
    methionine: Optional[Grams] = None
    phenylalanine: Optional[Grams] = None
    threonine: Optional[Grams] = None
    tryptophan: Optional[Grams] = None
    tyrosine: Optional[Grams] = None
    valine: Optional[Grams] = None

    def __add__(self, rhs: Proteins) -> Proteins:
        return Proteins(
            protein=_safe_add(self.protein, rhs.protein),
            cystine=_safe_add(self.cystine, rhs.cystine),
            histidine=_safe_add(self.histidine, rhs.histidine),
            isoleucine=_safe_add(self.isoleucine, rhs.isoleucine),
            leucine=_safe_add(self.leucine, rhs.leucine),
            lysine=_safe_add(self.lysine, rhs.lysine),
            methionine=_safe_add(self.methionine, rhs.methionine),
            phenylalanine=_safe_add(self.phenylalanine, rhs.phenylalanine),
            threonine=_safe_add(self.threonine, rhs.threonine),
            tryptophan=_safe_add(self.tryptophan, rhs.tryptophan),
            tyrosine=_safe_add(self.tyrosine, rhs.tyrosine),
            valine=_safe_add(self.valine, rhs.valine),
        )

class NutritionComposition(BaseModel):
    serving_size: ServingSize = Field(default_factory=lambda:ServingSize())
    calories: Optional[KCal] = None
    alcohol: Optional[Grams] = None
    caffeine: Optional[Grams] = None
    water: Optional[Grams] = None
    vitamins: Vitamins = Field(default_factory=lambda:Vitamins())
    minerals: Minerals = Field(default_factory=lambda:Minerals())
    carbohydrates: Carbohydrates = Field(default_factory=lambda:Carbohydrates())
    lipids: Lipids = Field(default_factory=lambda:Lipids())
    proteins: Proteins = Field(default_factory=lambda:Proteins())

    def __add__(self, rhs: NutritionComposition) -> NutritionComposition:
        if (self.serving_size != rhs.serving_size):
            raise InvalidAddOperation("The serving sizes must be equal to perform an add operation")
        return NutritionComposition(
            serving_size=self.serving_size,
            calories=_safe_add(self.calories, rhs.calories),
            alcohol=_safe_add(self.alcohol, rhs.alcohol),
            caffeine=_safe_add(self.caffeine, rhs.caffeine),
            water=_safe_add(self.water, rhs.water),
            vitamins=self.vitamins + rhs.vitamins,
            minerals=self.minerals + rhs.minerals,
            carbohydrates=self.carbohydrates + rhs.carbohydrates,
            lipids=self.lipids + rhs.lipids,
            proteins=self.proteins + rhs.proteins
        )

class OptionalNutritionComposition(BaseModel):
    serving_size: Optional[OptionalServingSize] = None
    calories: Optional[KCal] = None
    alcohol: Optional[Grams] = None
    caffeine: Optional[Grams] = None
    water: Optional[Grams] = None
    vitamins: Optional[Vitamins] = None
    minerals: Optional[Minerals] = None
    carbohydrates: Optional[Carbohydrates] = None
    lipids: Optional[Lipids] = None
    proteins: Optional[Proteins] = None


class FoodCategory(StrEnum):
    custom = "custom"


class FoodVA(BaseModel):
    name: str = Field(min_length=1)
    group: FoodGroup = Field(default=FoodGroup.unknown)
    nutrition: NutritionComposition = Field(default_factory=lambda:NutritionComposition())
    additional_serving_sizes: list[ServingSize] = Field(default_factory=list)
    ingredient_list: list[str] = Field(default_factory=list)


class OptionalFoodVA(BaseModel):
    name: Optional[str] = None
    group: Optional[FoodGroup] = None
    nutrition: Optional[OptionalNutritionComposition] = None
