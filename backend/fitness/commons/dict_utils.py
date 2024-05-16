from copy import deepcopy
from typing import Any


def delete_null_keys_from_dict(to_delete_nulls: Any) -> Any:  # hard to type
    copy_to_delete_nulls = deepcopy(to_delete_nulls)

    def delete_null(d):
        if isinstance(d, list):
            for i in d:
                delete_null(i)
        elif isinstance(d, dict):
            for k, v in d.copy().items():
                if v == None:
                    d.pop(k)
                else:
                    delete_null(v)

    delete_null(copy_to_delete_nulls)
    return copy_to_delete_nulls
