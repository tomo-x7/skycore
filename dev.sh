cd $(dirname ${0})
inotifywait -e CREATE -e DELETE -e MODIFY -m ./ | while read notice
do
echo change
done