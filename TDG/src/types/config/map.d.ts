export interface MapInfo {
    width: number,
    height: number,
    paths: Paths,
    towerPosition: Points
}
type Paths = Path[]
type Path = Point[]
type Points = Point[]
type Point = [number, number]