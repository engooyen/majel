/**
 * Copyright 2019 John H. Nguyen
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json"

let talents = []

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  })
  console.log("Authorize this app by visiting this url:", authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question("Enter the code from that page here: ", code => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error("Error while trying to retrieve access token", err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err)
        console.log("Token stored to", TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

module.exports = {
  talents: [],
  /**
   * Prints the names and majors of students in a sample spreadsheet:
   * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */
  readSources(auth) {
    const sheets = google.sheets({ version: "v4", auth })
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "137sWSohg8Jgl4TDpF_5s-y8xJHeLO1y-245g-cTkm2U",
        range: "Sheet1!A:Z"
      },
      (err, res) => {
        if (err) {
          return console.log("The API returned an error: " + err)
        }

        const rows = res.data.values
        if (rows.length) {
          for (let r in rows) {
            let state = "name"
            let talent = {}
            const cells = rows[r]
            for (let c in cells) {
              let cell = cells[c]
              switch (state) {
                case "name":
                  if (cell) {
                    talent.name = cell
                    state = "description"
                  }
                  break
                case "description":
                  if (cell) {
                    talent.description = cell
                    state = "requirement"
                  }
                  break
                case "requirement":
                  if (cell) {
                    talent.requirement = cell
                    state = "done"
                  }
                  break
              }

              if (state === "done") {
                talents.push(talent)
                break
              }
            }
          }
        } else {
          console.log("No data found.")
        }

        this.talents = talents
        console.warn(this.talents)
      }
    )
  },
  loadSourceBook() {
    // Load client secrets from a local file.
    fs.readFile("credentials.json", (err, content) => {
      if (err) {
        return console.log("Error loading client secret file:", err)
      }
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), this.readSources)
    })
  }
}
