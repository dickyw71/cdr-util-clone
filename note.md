# Design notes
## Command-line arguments
`cdr-util filepath inputFilename [-v] [outputFilename]`

1. filepath          The filepath where the input files are read and the output files written.

2. inputFilename     The name of the file to read the list of sensors cdr-util to query.
                    The output csv filename and CDR log filenames are prefixed with this filename.

3. [outFilename]     Optional, if used cdr-util will export a csv file for each sensor found in the query list.

4. [-v]              With this option verbose output is written to the output file.


- []    Need to check that `filepath` is a valid file system location that the program can access