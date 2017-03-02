# line-list-to-json

CLI for turning a line separated list to a JSON array

## Installation

`npm i -g line-list-to-json`

## Usage

InFile.txt
```
some list
separated
by many lines

that was a blank one
```

Command Line:
```
lljson relative/path/to/InFile.txt relative/path/to/OutFile
```

OutFile.json:
``` json
[
    "some list",
    "separated",
    "by many lines",
    "",
    "that was a blank one"
]
```

## Optional params

### Pretty

Pretty print JSON. Assign value for spacing.  
```
[-p, --pretty=2]
```

### Overwrite

Overwrite the outFile if it already exists.  
```
[-o, --overwrite]
```