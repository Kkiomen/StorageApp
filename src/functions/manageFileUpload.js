import firebase, {db,storage} from "../../firebase";
const manageFileUpload = async (
    fileBlob,
    { onStart, onProgress, onComplete, onFail }
) => {

    const imgName = "img-" + new Date().getTime();

    const storageRef = storage.ref(`images/${imgName}.jpg`);

    console.log("uploading file", imgName);

    // Create file metadata including the content type
    const metadata = {
        contentType: "image/jpeg",
    };
    // Trigger file upload start event
    onStart && onStart();
    const uploadTask = storageRef.put(fileBlob, metadata);
    uploadTask.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    });

    uploadTask.then(() => {
        console.log('Image uploaded to the bucket!');
    });
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            // Monitor uploading progress
            onProgress && onProgress(Math.fround(progress).toFixed(2));
            console.log(progress)
        },
        (error) => {
            // Something went wrong - dispatch onFail event with error  response
            onFail && onFail(error);
        },
        () => {
            // Upload completed successfully, now we can get the download URL

            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // dispatch on complete event
                onComplete && onComplete(downloadURL);

                console.log("File available at", downloadURL);
            });
        }
    );
};

export default manageFileUpload;
