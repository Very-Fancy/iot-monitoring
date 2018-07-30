<?php
$valid_extensions = array('jpeg', 'jpg', 'png', 'gif', 'bmp' , 'pdf' , 'doc' , 'ppt'); // valid extensions
$path = 'uploads/'; // upload directory

if( $_FILES['image'])
{
    $img = $_FILES['image']['name'];
    $tmp = $_FILES['image']['tmp_name'];

    $final_image = $img;

    $path = $path.strtolower($final_image);

    if(move_uploaded_file($tmp,'./'.$path))
    {
        echo "<img class = 'prev' src='".$path."' />";

    }
    else
    {
        echo 'invalid';
    }
}
?>
