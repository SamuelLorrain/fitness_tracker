from types import ModuleType
from typing import Callable
from fastapi import Request
from fastapi.responses import JSONResponse
from fitness.commons.exceptions import CustomException
from fastapi import FastAPI
import inspect


