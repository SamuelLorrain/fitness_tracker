import inspect
from types import ModuleType
from typing import Callable

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from fitness.commons.exceptions import CustomException
