import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

scheme = HTTPBearer(auto_error=False)

def require_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(scheme),
) -> dict:
    secret = os.getenv("ACCESS_TOKEN_SECRET", "")
    if len(secret) < 32 or not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="authentication is required")
    try:
        payload = jwt.decode(credentials.credentials, secret, algorithms=["HS256"])
        if not payload.get("sub"):
            raise ValueError("missing subject")
        return payload
    except (jwt.InvalidTokenError, ValueError) as exc:
        raise HTTPException(status_code=401, detail="invalid token") from exc
