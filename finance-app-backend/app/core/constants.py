from enum import Enum


class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


class BudgetCategory(str, Enum):
    ENTERTAINMENT = "entertainment"
    BILLS = "bills"
    GROCERIES = "groceries"
    DINING = "dining"
    TRANSPORTATION = "transportation"
    PERSONAL_CARE = "personal_care"
    EDUCATION = "education"
    UTILITIES = "utilities"
    OTHER = "other"


class RecurringBillStatus(str, Enum):
    UPCOMING = "upcoming"
    PAID = "paid"
    OVERDUE = "overdue"


class PotThemeColor(str, Enum):
    GREEN = "green"
    BLUE = "blue"
    RED = "red"
    PURPLE = "purple"
    YELLOW = "yellow"
    PINK = "pink"
