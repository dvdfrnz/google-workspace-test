from typing import Dict

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from authentication import get_credentials


def iterate_folders():
    creds = get_credentials()
    try:
        service = build("drive", "v3", credentials=creds)
        files = []
        page_token = None
        while True:
            # pylint: disable=maybe-no-member
            response = service.files().list(pageSize=10, fields="nextPageToken, files(id, name)").execute()
            files = response.get("files", [])

            for file in response.get("files", []):
                print(f'Found file: {file.get("name")}, {file.get("id")}')

            files.extend(response.get("files", []))
            page_token = response.get("nextPageToken", None)
            if page_token is None:
                break
    except HttpError as error:
        print(f"An error occurred: {error}")
        files = None

    return files


def get_spreadsheet_data(spreadsheetId: str, range: str) -> Dict | HttpError | None:
    creds = get_credentials()
    try:
        service = build("sheets", "v4", credentials=creds)
        result = service.spreadsheets().values().get(spreadsheetId=spreadsheetId, range=range).execute()
        return result
    except HttpError as error:
        print(f"An error occurred: {error}")
        return error


if __name__ == "__main__":
    data = get_spreadsheet_data(
        spreadsheetId="1GKFaa9mx8EKqN94DqO2UHP-jFUZwOyTaWGas9Cn9rSs",
        range="Tabellenblatt2!A1:E20",
    )
    files = iterate_folders()
    print(files)
