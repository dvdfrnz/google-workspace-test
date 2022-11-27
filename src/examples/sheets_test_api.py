from __future__ import print_function

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def get_values(spreadsheet_id, range_name):
    """
    Creates the batch_update the user has access to.
    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """
    try:
        service = build("sheets", "v4", developerKey="AIzaSyACSHC_p3mCAsUdJZBRpqMEQhLvlMkYndE")
        result = service.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        rows = result.get("values", [])
        print(f"{len(rows)} rows retrieved")
        return result
    except HttpError as error:
        print(f"An error occurred: {error}")
        return error


if __name__ == "__main__":
    # Pass: spreadsheet_id, and range_name
    get_values("1GKFaa9mx8EKqN94DqO2UHP-jFUZwOyTaWGas9Cn9rSs", "A1:B3")
