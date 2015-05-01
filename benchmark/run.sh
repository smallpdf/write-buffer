export BUFFER_SIZE=1024

echo "# FS"
echo

echo "FS without buffer:"
time FILE="output1" BUFFER="none" node benchmark.js
echo

echo "FS with buffer:"
time FILE="output2" BUFFER="buffer" node benchmark.js
echo

echo "FS with cork:"
time FILE="output3" BUFFER="cork" node benchmark.js
echo 

echo "FS auto (buffer):"
time FILE="output4" BUFFER="auto" node benchmark.js
echo


echo "# TCP"
echo

echo "TCP without buffering:"
time FILE="tcp" BUFFER="none" node benchmark.js
echo

echo "TCP with buffering:"
time FILE="tcp" BUFFER="buffer" node benchmark.js
echo

echo "TCP with cork:"
time FILE="tcp" BUFFER="cork" node benchmark.js
echo

echo "TCP auto (cork):"
time FILE="tcp" BUFFER="auto" node benchmark.js
echo