import Proptypes from 'prop-types'

export const MessageShape = Proptypes.shape({
    id: Proptypes.number.isRequired,
    type: Proptypes.oneOf(['text', 'image', 'location']),
    text: Proptypes.string,
    uri: Proptypes.string,
    coordinate: Proptypes.shape({
        latitude: Proptypes.number.isRequired,
        longitude: Proptypes.number.isRequired
    })
});
let mesageId = 0;
    function getNextId() {
        mesageId +=1;
        return mesageId;
    }
    export function createTextMesage(text) {
        return {
            type:'text',
            id: getNextId(),
            text,
        }
    }
export function createImageMessage(uri) {
    return {
        type: 'image',
        id: getNextId(),
        uri,
    };
}
export function createLocationMessage(coordinate) {
    return {
        type: 'location',
        id: getNextId(),
        coordinate,
    }
}