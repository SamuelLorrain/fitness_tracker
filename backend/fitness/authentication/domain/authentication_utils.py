from fitness.authentication.domain.entities import AuthPassKey, Permission


def has_permission(permission: Permission, auth_pass_key: AuthPassKey) -> bool:
    return permission in auth_pass_key.permissions
