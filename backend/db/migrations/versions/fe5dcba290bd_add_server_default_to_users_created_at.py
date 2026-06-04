"""add server_default to users.created_at

Revision ID: fe5dcba290bd
Revises: 18d0675599ac
Create Date: 2026-06-01 15:54:39.684459

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fe5dcba290bd'
down_revision: Union[str, Sequence[str], None] = '18d0675599ac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "created_at",
        server_default=sa.text("now()"),
    )


def downgrade() -> None:
    op.alter_column(
        "users",
        "created_at",
        server_default=None,
    )
