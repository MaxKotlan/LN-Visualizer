import * as THREE from 'three';
import { BufferGeometry, Material, Matrix4, Ray, Sphere, Vector3 } from 'three';
import { NodePositionOffsetService } from '../services';

const _inverseMatrix = /*@__PURE__*/ new Matrix4();
const _ray = /*@__PURE__*/ new Ray();
const _sphere = /*@__PURE__*/ new Sphere();
const _position = /*@__PURE__*/ new Vector3();

export class NodePoint extends THREE.Points {
    constructor(
        private nodePositionOffsetSevice: NodePositionOffsetService,
        geometry?: BufferGeometry,
        material?: Material,
    ) {
        super(geometry, material);
    }

    override raycast(raycaster, intersects) {
        const geometry = this.geometry;
        const matrixWorld = this.matrixWorld;
        const threshold = raycaster.params.Points.threshold;
        const drawRange = geometry.drawRange;

        // Checking boundingSphere distance to ray

        if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

        _sphere.copy(geometry.boundingSphere);
        _sphere.applyMatrix4(matrixWorld);
        _sphere.radius += threshold;

        if (raycaster.ray.intersectsSphere(_sphere) === false) return;

        //

        _inverseMatrix.copy(matrixWorld).invert();
        _ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

        const localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
        const localThresholdSq = localThreshold * localThreshold;

        if (geometry.isBufferGeometry) {
            const index = geometry.index;
            const attributes = geometry.attributes;
            const positionAttribute = attributes.position;

            if (index !== null) {
                const start = Math.max(0, drawRange.start);
                const end = Math.min(index.count, drawRange.start + drawRange.count);

                for (let i = start, il = end; i < il; i++) {
                    const a = index.getX(i);

                    _position.fromBufferAttribute(positionAttribute, a);

                    console.log(this.nodePositionOffsetSevice);
                    this.nodePositionOffsetSevice.applyOffset(_position);

                    testPoint(
                        _position,
                        a,
                        localThresholdSq,
                        matrixWorld,
                        raycaster,
                        intersects,
                        this,
                    );
                }
            } else {
                const start = Math.max(0, drawRange.start);
                const end = Math.min(positionAttribute.count, drawRange.start + drawRange.count);

                for (let i = start, l = end; i < l; i++) {
                    _position.fromBufferAttribute(positionAttribute, i);

                    this.nodePositionOffsetSevice.applyOffset(_position);

                    testPoint(
                        _position,
                        i,
                        localThresholdSq,
                        matrixWorld,
                        raycaster,
                        intersects,
                        this,
                    );
                }
            }
        } else {
            console.error(
                'THREE.Points.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.',
            );
        }
    }

    private timeVec: Vector3 = new Vector3(0, 0, 0);
    // private motionOrigin: Vector3 = new Vector3(0, 0, 0);
    // private motionIntensity: number = 0.01;

    // public offsetPos(vec3: Vector3) {
    //     const test = vec3.clone();
    //     const origDist = Math.sqrt(this.motionOrigin.distanceTo(test));
    //     test.multiplyScalar(origDist).multiplyScalar(this.motionIntensity).multiply(this.timeVec);

    //     vec3.add(test);
    //     // .add(new Vector3(30, 0, 0));
    // }

    // public setMotionIntenstiy(intensity: number) {
    //     this.motionIntensity = intensity;
    // }

    // public setMotionOrigin(motionOrigin: Vector3) {
    //     this.motionOrigin = motionOrigin;
    // }

    // public setSinTime(sin: number) {
    //     this.timeVec.setX(sin);
    // }

    // public setCosTime(cos: number) {
    //     this.timeVec.setY(cos);
    //     this.timeVec.setZ(cos);
    // }
}

//NodePoint.prototype.isPoints = true;

function testPoint(
    point: Vector3,
    index,
    localThresholdSq,
    matrixWorld,
    raycaster,
    intersects,
    object,
) {
    const rayPointDistanceSq = _ray.distanceSqToPoint(point);

    if (rayPointDistanceSq < localThresholdSq) {
        const intersectPoint = new Vector3();

        _ray.closestPointToPoint(point, intersectPoint);
        intersectPoint.applyMatrix4(matrixWorld);

        const distance = raycaster.ray.origin.distanceTo(intersectPoint);

        if (distance < raycaster.near || distance > raycaster.far) return;

        intersects.push({
            distance: distance,
            distanceToRay: Math.sqrt(rayPointDistanceSq),
            point: intersectPoint,
            index: index,
            face: null,
            object: object,
        });
    }
}
