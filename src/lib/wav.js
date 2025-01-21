/* utility - Wave file writing */
// modified by j5v, from: http://stackoverflow.com/questions/28804356/how-to-export-timbre-js-buffer-to-wav-or-any-other-audio-file-format
import { appInfo } from './appInfo.js'

function floatTo16BitPCM(output, offset, input) {
	var bytesPerSample = 2;
	for (var i = 0; i < input.length; i++, offset += bytesPerSample) {
		var s = Math.max(-1, Math.min(1, input[i]));
		output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
	}
}

function floatTo32BitPCM(output, offset, input) { // TODO: test
	var bytesPerSample = 4;
	for (var i = 0; i < input.length; i++, offset += bytesPerSample) {
		var s = Math.max(-1, Math.min(1, input[i]));
		output.setInt32(offset, s < 0 ? s * 0x80000000 : s * 0x7FFFFFFF, true);
	}
}

function writeString(view, offset, string) {
	for (var i = 0; i < string.length; i++) {
		view.setUint8(offset + i, string.charCodeAt(i));
	}
}

function encodeWAV(buf, sr, ch) {
	const bytesPerSample = 2;
	const bitsPerSample = 16;


	const sizeOfRIFFHeader = 12;

	const offsetFmt = sizeOfRIFFHeader;
	const sizeOfFmt = 16;
	const sizeOfFmtChunk = sizeOfFmt + 8;

	const offsetData = offsetFmt + sizeOfFmtChunk;
	const audioDataLength = buf.length * ch * bytesPerSample;
	const sizeOfDataChunk = audioDataLength + 8;

	const offsetList = offsetData + sizeOfDataChunk;
	const commentLength = appInfo.generatedFileBoopMetadata.length;
	const sizeOfList = commentLength + 12;
	const sizeOfListChunk = sizeOfList + 8;

	const sizeOfRIFF = sizeOfRIFFHeader + sizeOfFmtChunk + sizeOfDataChunk + sizeOfListChunk;

	const buffer = new ArrayBuffer (sizeOfRIFF);
	const view = new DataView(buffer);


	// RIFF header (size: 12)
	/* RIFF identifier */
	writeString(view, 0, 'RIFF');

	/* file length */
	view.setUint32(4, sizeOfRIFF, true);

	/* RIFF type */
	writeString(view, 8, 'WAVE');


	// chunk: fmt (size: 24)
	/* format chunk identifier */
	writeString(view, offsetFmt + 0, 'fmt ');

	/* format chunk length */
	view.setUint32(offsetFmt + 4, sizeOfFmt, true);

	/* sample format (raw) */
	view.setUint16(offsetFmt + 8, 1, true);

	/* channel count */
	view.setUint16(offsetFmt + 10, 1, true);

	/* sample rate */
	view.setUint32(offsetFmt + 12, sr, true);

	/* byte rate (sample rate * block align) */
	view.setUint32(offsetFmt + 16, sr * 2, true);

	/* block align (channel count * bytes per sample) */
	view.setUint16(offsetFmt + 20, bytesPerSample, true);

	/* bits per sample */
	view.setUint16(offsetFmt + 22, bitsPerSample, true);


	// chunk: data
	/* data chunk identifier */
	writeString(view, offsetData, 'data');

	/* data chunk length */
	view.setUint32(offsetData + 4, audioDataLength, true);

	/* PCM data */
	floatTo16BitPCM(view, offsetData + 8, buf);


	// chunk: LIST
	/* LIST chunk identifier and size*/
	writeString(view, offsetList, 'LIST');
	view.setUint32(offsetList + 4, sizeOfList, true);

	writeString(view, offsetList + 8, 'INFO');

	writeString(view, offsetList + 12, 'ISFT');
	view.setUint32(offsetList + 16, commentLength, true);
	writeString(view, offsetList + 20, appInfo.generatedFileBoopMetadata);

	return view;
}

export {
  encodeWAV
}