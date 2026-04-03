export function createGrid(size = 20, spacing = 30){

const grid = []

for(let x=-size;x<=size;x++){
for(let z=-size;z<=size;z++){

grid.push({
x: x * spacing,
z: z * spacing
})

}
}

return grid
}