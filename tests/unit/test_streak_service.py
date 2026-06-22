import datetime

import pytest

from backend.services.streak import calculate_current_streak


@pytest.mark.streaks
@pytest.mark.parametrize("start, actual_length", [(0, 1), (0, 10), (1, 1), (1, 10)])
def test_streak_active(start, actual_length, create_habit, completion_factory, db_session):
    today = datetime.date.today()
    end = actual_length + start

    for n in range(start, end):
        log_date = today - datetime.timedelta(days=n)
        completion_factory.create(habit=create_habit, logged_at=log_date)

    streak_length = calculate_current_streak(
        db_session,
        create_habit.user.id,
        create_habit.id,
        today,
    )

    assert streak_length == actual_length


@pytest.mark.streaks
def test_streak_resets_to_zero(create_habit, completion_factory, db_session):
    today = datetime.date.today()
    completions_pattern = [2, 3, 5, 6, 7]

    for n in completions_pattern:
        completion_factory.create(habit=create_habit, logged_at=today - datetime.timedelta(days=n))

    streak_length = calculate_current_streak(
        db_session,
        create_habit.user.id,
        create_habit.id,
        today,
    )

    assert streak_length == 0


@pytest.mark.streaks
@pytest.mark.parametrize(
    "completions_pattern, actual_length", [([-1, 0, 1, 2], 3), ([-1, 1, 2], 2)]
)
def test_future_dates_ignored(
    completions_pattern, actual_length, create_habit, completion_factory, db_session
):
    today = datetime.date.today()

    for n in completions_pattern:
        completion_factory.create(habit=create_habit, logged_at=today - datetime.timedelta(days=n))

    streak_length = calculate_current_streak(
        db_session,
        create_habit.user.id,
        create_habit.id,
        today,
    )

    assert streak_length == actual_length
