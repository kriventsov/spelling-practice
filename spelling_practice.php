<?php 
  
  $content =  file_get_contents("spelling_practice.txt"); 
  echo json_encode(explode('&', $content));
  
?>