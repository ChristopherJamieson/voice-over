//if ("orientation" in screen)
//{
//    alert(1);
//}
//else
//    alert(2);



/******************************************************************************/
/* We need to run fitBannter to refit the banner and its background to the
   screen.  We do this both on startup and as a result of changes to the
   screen orientation.  In the latter case, however, we need to wait a while
   before doing anything, because the code here is notified of a change to
   the orientation as soon as it happens, and at that point things may not have
   adjusted their sizes to the new orientation. */

function initialise ()
{
    fitBanner();
    window.onorientationchange = function() { setTimeout(fitBanner, 1000); }
    window.onresize = function() { setTimeout(fitBanner, 100); }
}


/******************************************************************************/
function fitBanner ()
{
    /**************************************************************************/
    /* Arbitrary sizing -- we need to limit the scaled width of the image so
       that we don't end up having the thing also very tall. */

    var C_MaxProportionOfWidthToBeTakenUpByBackgroundImage = 0.6;



    /**************************************************************************/
    var C_MinProportionOfScreenHeightToBeOccupiedByBackgroundImage = 0.3;


    
    /**************************************************************************/
    /* Experiment suggests that on a large screen, the banner text probably
       needs to be scaled up by a certain amount. */
    
    var C_DefaultBannerTextScaling = 1.2;


    
    /**************************************************************************/
    /* The approximate width (in pixels) of the head which appears on the
       background.  We need this so we can position things clear of the head.
       This figure was determined by measuring, and will need to be changed
       if we move to a new image. */
    
    var C_WidthOfHeadOnBackgroundImage = 1500;



    /**************************************************************************/
    /* Prevent the banner text from becoming ridiculously large in relation
       to the screen. */
    
    var C_MaxProportionOfHeightToBeOccupiedByBannerText = 0.4;


    
    /**************************************************************************/
    var holderWidth = getComputedStyle(document.getElementById("chris-banner-holder")).width.replace("px", "");
    var imgPic = document.getElementById("chris-banner-image");



    /**************************************************************************/
    /* Scale on the assumption that we'll go with the maximum width we're
       prepared to accept for the background. */
    
    var putativeBackgroundWidth = C_MaxProportionOfWidthToBeTakenUpByBackgroundImage * holderWidth;
    var backgroundFac =  putativeBackgroundWidth / imgPic.naturalWidth;
    var putativeBackgroundHeight = backgroundFac * imgPic.naturalHeight;



    /**************************************************************************/
    /*
    alert(imgPic.naturalWidth + 'x ' + imgPic.naturalHeight);
    alert(holderWidth);
    alert(putativeBackgroundWidth.toString() + ' x ' + putativeBackgroundHeight.toString());
    */



    /**************************************************************************/
    /* If necessary, rejig the scaling so that the image is not ridiculously
       short.  Then set the height and width parameters for the background
       image. */
    
    if (putativeBackgroundHeight < C_MinProportionOfScreenHeightToBeOccupiedByBackgroundImage * window.screen.height)
    {
	putativeBackgroundHeight = window.screen.height * C_MinProportionOfScreenHeightToBeOccupiedByBackgroundImage;
	backgroundFac = putativeBackgroundHeight / imgPic.naturalHeight;
        putativeBackgroundWidth = backgroundFac * imgPic.naturalWidth;
	imgPic.style.height = putativeBackgroundHeight + "px";
        imgPic.style.width = "auto";
    }
    else
    {
	imgPic.style.width = putativeBackgroundWidth.toString() + "px";
        imgPic.style.height = "auto";
    }



    /**************************************************************************/
    var imgDiv = document.getElementById("chris-banner-text-div");
    var imgText = document.getElementById("chris-banner-text-img");


    /**************************************************************************/
    /* The right-hand side of the text is the overall width of the container,
       less a certain amount to ensure the text is clear of the head which
       appears on the background image.  This amount is obtained by scaling the
       actual width of the head by the same amount as the background image is
       itself being scaled by. */
    
    var rightOfText = holderWidth - (putativeBackgroundWidth / imgPic.naturalWidth) * C_WidthOfHeadOnBackgroundImage;


    
    /**************************************************************************/
    /* We now need to scale the text to fit.  We start off on the assumption
       that we're ok with the maximum possible scaling we're prepared to
       countenance, and then reign things back if that looks as though it's
       going to make things too big. */
    
    var textFac = C_DefaultBannerTextScaling;
    var putativeTextHeight = textFac * imgText.naturalHeight;
    if (putativeTextHeight > C_MaxProportionOfHeightToBeOccupiedByBannerText * putativeBackgroundHeight)
	textFac = C_MaxProportionOfHeightToBeOccupiedByBannerText * putativeBackgroundHeight / putativeTextHeight;


	
    /**************************************************************************/
    /* The left of the text can now be determined by location of the right as
       determined above, and subtracting the width of the scaled text.  Except
       that it's possible this may place the text off the left of the screen,
       so we need to adjust the scale factor until it's not off the left. */
    
    var leftOfText;
    while (true)
    {
	leftOfText = rightOfText - textFac * imgText.naturalWidth;
	if (leftOfText > 20) break;
	textFac = 0.9 * textFac;
    }



    /**************************************************************************/
    /* Just when you thought we'd finished ...  It's possible after all these
       machinations that the left of the text is actually off the left of the
       screen, in which case we need to reduce the scale factor until it's
       clear of it. */
    
    imgDiv.style.left = leftOfText + "px";
    imgText.style.width = (textFac * imgText.naturalWidth) + "px";
    imgText.style.height = "auto";



    /**************************************************************************/
    /* We now need to adjust the top so that the text is centered vertically.
       I haven't worked out why apparently you _don't_ want to take the
       height of the scaled text into account, but experience suggests you
       don't. */
    
    var topOfText = (imgPic.parentElement.clientHeight / 2);     // - textFac * imgText.naturalHeight / 2;
    imgDiv.style.top = topOfText + "px";
}

  


