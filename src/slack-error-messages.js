/** 
 * These were manually pulled from the slack minified source
 * They could change, and it's possible I may have missed something
 *  with error_bad_name logic from the minified source.
 * There could also be additional keys that may have been spread out
 *  that I failed to catch as well.
*/
const tooMuch = "This image is a bit too big, even after resizing. A smaller file might help?";
const badName = "Names must be lowercase, and can't contain spaces, periods, or most punctuation.";
const errorMessages = {
  "error_bad_upload": "Something happened that prevented your file from being uploaded. Try again?",
  "error_bad_format": "Please make sure your file is a GIF, JPEG, or PNG.",
  "resized_but_still_too_large": tooMuch,
  "too_many_frames": tooMuch,
  "error_too_big": "Please choose an image smaller than 64KB.",
  "error_name_taken_i18n": "Unfortunately, the international emoji set already includes an emoji by this name. Mind trying a different name?",
  "error_name_taken": "The name is already in use by another emoji.",
  "error_bad_name": badName,
  "error_bad_name_i18n": badName
}

export default function getSlackErrorMessage(key) {
  return errorMessages[key] || key;
}
