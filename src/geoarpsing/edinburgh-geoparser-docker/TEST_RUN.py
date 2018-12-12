import subprocess, os

batch_file = "in/testing1.txt"
counter = 0

working_directory = "~/Projects/external/geoparser-v1.1/"
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

with open(batch_file) as file_in:
    lines = (line.rstrip() for line in file_in)
    lines = (line for line in lines if line)

    for line in lines:

        # write line of test data to file
        folder = "in/lines/"
        counter += 1
        if not "//" in line:
            line_name = str(line)
            file_name = folder + str(counter) + ".txt" # + line_name
            line_file = open(file_name, "w")
            line_file.write(line)

            # read line, run sh command, check outputs
            script_to_run = "LXDEBUG=1 cat " + file_name + " | scripts/run -t plain -g geonames"
            print script_to_run
            # os.system(script_to_run)

            output = subprocess.Popen("ls", cwd=r'Users/Thomas/Projects/external/geoparser/' ) # stdout=subprocess.PIPE.communicate()[0]
            output.wait()
            out, err = output.communicate()
            print out

    file_in.close()
