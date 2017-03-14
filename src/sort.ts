export function sort(array: any[], asc: boolean) {
    if (asc == null) asc = true
    for (var i = 0; i < array.length; i++) {
        var smallest = i;
        for (var j = i + 1; j < array.length; j++) {
            if (asc ? array[j] < array[smallest] : array[j] > array[smallest]) {
                smallest = j
            }
        }
        var t = array[i];
        array[i] = array[smallest];
        array[smallest] = t;
    }
    return array;
}