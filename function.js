// Load Catalog JS File
// $.getScript('https://elearn.usu.edu/designtools/dev/js/tools_liveView.js', function () {
//     console.log("Catalog Global File Loaded");
// });

var klColorsLive = {
    // Determine whether black or white text offers best contrast
    getContrastYIQ: function (hexcolor) {
        'use strict';
        if (hexcolor.indexOf('#') > -1) {
            hexcolor = hexcolor.replace('#', '');
        }
        var r = parseInt(hexcolor.substr(0, 2), 16),
            g = parseInt(hexcolor.substr(2, 2), 16),
            b = parseInt(hexcolor.substr(4, 2), 16),
            yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    },
    getContrast50: function (hexcolor) {
        'use strict';
        return (parseInt(hexcolor, 16) > 0xffffff / 2) ? 'black' : 'white';
    },
    // Convert rgb color to hex
    hex: function (x) {
        'use strict';
        return ("0" + parseInt(x).toString(16)).slice(-2);
    },
    rgb2hex: function (rgb) {
        'use strict';
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
    },
    hexCheck: function (color) {
        'use strict';
        try {
            // Check a color and convert it to hex if needed
            if (color.indexOf('rgb') > -1) {
                color = klColorsLive.rgb2hex(color);
            }
            return color;
        } catch (err) {
            klLiveView.errorHandling('Hex Check', err);
        }
    }
},
klPanelsLive = {
    lightDarkClass: function (bgColor) {
        'use strict';
        // return a white or black class to apply to panels based on bg color
        try {
            var bghex = klColorsLive.hexCheck(bgColor),
                newClass = klColorsLive.getContrastYIQ(bghex);
            return newClass;
        } catch (err) {
            klLiveView.errorHandling('Light Dark Class', err);
        }
    },
    accordionCheck: function () {
        'use strict';
        try {
            if ($('.kl_panels_accordion').length > 0) {
                $('.kl_panels_accordion').each(function (index) {
                    if (!$(this).hasClass('ui-accordion')) {
                        var icons, activePanel;
                        $(this).attr('id', 'kl_accordion_' + index);
                        icons = {
                            header: "ui-icon-triangle-1-e",
                            activeHeader: "ui-icon-triangle-1-s"
                        };
                        if ($('#kl_accordion_' + index + ' .kl_current').length > 0) {
                            activePanel = parseInt($('#kl_accordion_' + index + ' .kl_current').attr('id').replace('kl_panel_', ''));
                        } else {
                            activePanel = false;
                        }
                        $('#kl_accordion_' + index + ' .kl_panel_heading').each(function () {
                            $(this).wrapInner('<a href="#"/>');
                        });
                        // Slight delay added because of an issue with Panopto videos not working in tabs probably impacts accordions
                        if ($('#kl_wrapper_3 .kl_panels_wrapper iframe').length > 0) {
                            setTimeout(function () {
                                $('#kl_accordion_' + index).accordion({
                                    heightStyle: "content",
                                    icons: icons,
                                    collapsible: true,
                                    active: activePanel //which panel is open by default
                                });
                            }, 1000);
                        } else {
                            $('#kl_accordion_' + index).accordion({
                                heightStyle: "content",
                                icons: icons,
                                collapsible: true,
                                active: activePanel //which panel is open by default
                            });
                        }
                        $('#kl_accordion_' + index + ' .kl_panel_heading').each(function () {
                            var myId = $(this).attr('id'),
                                bgColor = $('#' + myId).css('background-color'),
                                textColorClass = '',
                                inlineStyle = $(this).attr('style');
                            if (inlineStyle !== undefined && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                                if (inlineStyle.indexOf('background') > -1) {
                                    textColorClass = klPanelsLive.lightDarkClass(bgColor);
                                }
                            }
                            $(this).addClass(textColorClass);
                        });
                    }
                });
            }
        } catch (err) {
            klLiveView.errorHandling('Accordion Check', err);
        }
    },
    tabCheck: function () {
        'use strict';
        try {
            if ($('.kl_panels_tabs').length > 0) {
                // turn h4s into li's to create navigation section
                $('.kl_panels_tabs').each(function (index) {
                    $(this).attr('id', 'kl_tabs_' + index);
                    var $parentSection = $(this),
                        activeTab = 0;
                    if ($('#kl_tabs_' + index + ' > .kl_panel_heading').length > 0) {
                        $parentSection.prepend('<ul class="kl_temp_tab_list_' + index + '" />');
                        $('#kl_tabs_' + index + ' > .kl_panel_heading').each(function () {
                            var myTitle = $(this).html(),
                                myClass = $(this).attr('class'),
                                myID = $(this).attr('id'),
                                myTarget = myID,
                                bgColor = $('#' + myID).css('background-color'),
                                textColorClass = '',
                                tabStyle = '',
                                inlineStyle = $(this).attr('style');
                            if (inlineStyle !== undefined && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                                if (inlineStyle.indexOf('background') > -1) {
                                    textColorClass = klPanelsLive.lightDarkClass(bgColor);
                                    tabStyle = 'style="background-color: ' + bgColor + '; border-color: ' + bgColor + ';"';
                                }
                            }
                            // Make sure the tab heading titles are wrapped in <a href="#">
                            $('#kl_tabs_' + index + ' > .kl_temp_tab_list_' + index).append('<li class="' + myClass + ' ' + textColorClass + '"><a href="#' + myTarget + '_content"  ' + tabStyle + '>' + myTitle + '</a>');
                            $(this).remove();
                        });
                    }

                    // initialize tabs
                    if ($(this).find('.kl_current').length > 0) {
                        activeTab = $(this).find('.kl_temp_tab_list_' + index + ' > li.kl_current').index();
                    }
                    // Slight delay added because of an issue with Panopto videos not working in lower tabs
                    if ($('#kl_wrapper_3 .kl_panels_wrapper iframe').length > 0 || $('#kl_wrapper_3 .kl_css_editor').length > 0) {
                        setTimeout(function () {
                            $('#kl_tabs_' + index).tabs({active: activeTab});
                        }, 1000);
                    } else {
                        $('#kl_tabs_' + index).tabs({active: activeTab});
                    }
                });
            }
        } catch (err) {
            klToolsLive.errorHandling('Tab Check', err);
        }
    },
    expandBoxCheck: function () {
        'use strict';
        try {
             if ($('.kl_panels_expander').length > 0) {
                    $('.kl_panels_expander').addClass('active ui-accordion');
                    $('.kl_panels_expander').each(function(index, el) {
                        var expandControls = '<div class="btn-group kl_expand_controls">' +
                            '<button class="bs-btn bs-btn-mid bs-btn-xs kl_expander_expand" aria-controls="kl_expander_' + index + '"><i class="fa fa-chevron-down" aria-hidden="true"></i> Expand All <span class="screenreader-only">Panels</span></button>' +
                            '<button class="bs-btn bs-btn-mid bs-btn-xs kl_expander_collapse" aria-controls="kl_expander_' + index + '" style="margin-left: -1px;"><i class="fa fa-chevron-up" aria-hidden="true"></i> Collapse All <span class="screenreader-only">Panels</span></button>' +
                            '</div>';
                        if (!$(this).hasClass('kl_no_expander_controls')) {
                            $(this).prepend(expandControls);
                        }
                        $(this).attr('id', 'kl_expander_' + index);
                    });
                    $('.kl_panels_expander > .kl_panel_content').hide().addClass('ui-accordion-content ui-accordion-content-active ui-widget-content');
                    $('.kl_panels_expander > .kl_panel_heading').each(function () {
                        var expandBoxTitle = $(this).text(),
                            expandBoxID = $(this).attr('id'),
                            bgColor = $('#' + expandBoxID).css('background-color'),
                            textColorClass = '',
                            inlineStyle = $(this).attr('style');
                        if (inlineStyle !== undefined && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                            if (inlineStyle.indexOf('background') > -1) {
                                textColorClass = klPanelsLive.lightDarkClass(bgColor);
                            }
                        }
                        $(this).addClass(textColorClass);
                        $(this).wrapInner('<a href="#" role="button" class="kl_panels_expander_toggler" aria-controls=""></a>');
                        $(this).find('a').prepend('<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>').attr({
                            'aria-controls': expandBoxID + '_content',
                            'aria-expanded': 'false'
                        });
                        $(this).addClass('ui-accordion-header ui-state-default');
                        $('#' + expandBoxID + '_content').attr('role', 'region');
                    });
                    $('.kl_panels_expander_toggler').unbind('click').click(function (e) {
                        e.preventDefault();
                        var $parentHeading = $(this).closest('.kl_panel_heading'),
                            connectedExpandBox = $(this).attr('aria-controls');
                        $parentHeading.toggleClass('kl_panels_expander_open');
                        if ($parentHeading.hasClass('kl_panels_expander_open')) {
                            $(this).attr('aria-expanded', 'true');
                        } else {
                            $(this).attr('aria-expanded', 'false');
                        }
                        $('#' + connectedExpandBox).slideToggle('fast').toggleClass('kl_panels_expander_open');
                        if ($('#' + connectedExpandBox).hasClass('kl_panels_expander_open')) {
                            $(this).parents('.ui-accordion-header').find('.ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
                            $(this).parents('.kl_panel_heading').addClass('ui-state-active');
                            $('#' + connectedExpandBox).attr({
                                'aria-hidden': 'false'
                            });
                        } else {
                            $(this).parents('.ui-accordion-header').find('.ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
                            $(this).parents('.kl_panel_heading').removeClass('ui-state-active');
                            $('#' + connectedExpandBox).attr({
                                'aria-hidden': 'true'
                            });
                        }
                        klLiveView.iframeResize();
                    });
                    // Add accordion classes on hover and focus
                    $('.kl_panels_expander_toggler').focusin(function () {
                        $(this).parents('.ui-accordion-header').addClass('ui-state-focus');
                    });
                    $('.kl_panels_expander_toggler').focusout(function () {
                        $(this).parents('.ui-accordion-header').removeClass('ui-state-focus');
                    });
                    $('.kl_panels_expander_toggler').mouseover(function () {
                        $(this).parents('.ui-accordion-header').addClass('ui-state-hover');
                    });
                    $('.kl_panels_expander_toggler').mouseout(function () {
                        $(this).parents('.ui-accordion-header').removeClass('ui-state-hover');
                    });
                    // Open on spacebar like jquery accordions
                    $('.kl_panels_expander_toggler').keydown(function (e) {
                         if (e.keyCode === 32) {
                            $(this).trigger('click');
                        }
                    });
                    // Open active panel
                    $('.kl_panels_expander .kl_current .kl_panels_expander_toggler').trigger('click');
                    // Expand/Collapse all controls
                    $('.kl_expander_expand').unbind('click').click(function () {
                        $(this).closest('.kl_panels_expander').children('.kl_panel_heading').each(function(index, el) {
                            if (!$(this).hasClass('kl_panels_expander_open')) {
                                $(this).find('.kl_panels_expander_toggler').trigger('click');
                            }
                        });
                    });
                    $('.kl_expander_collapse').unbind('click').click(function () {
                        $(this).closest('.kl_panels_expander').children('.kl_panel_heading.kl_panels_expander_open').find('.kl_panels_expander_toggler').trigger('click');
                    });
                }
        } catch (err) {
            klLiveView.errorHandling('Expand Box', err);
        }
    },
    configure: function () {
        'use strict';
        try {
            this.accordionCheck();
            this.tabCheck();
            this.expandBoxCheck();
        } catch (err) {
            // alert('Configure Panels', err);
            klLiveView.errorHandling('Configure Panels', err);
        }
    }
},
testing = {
    consoleTextArea: function() {
        'use strict';
        for (var b in window) {
            if(window.hasOwnProperty(b)) $('#kl_app_console').append('<div>' + b + '</div>');
        }
        $('body').prepend('<textarea id="fillMe" style="width:50%;height:50px; margin:auto;"></textarea>');
        $('#fillMe').val('\n' + $('html').html());
    },
    themeToggle: function() {
        'use strict';
        if ($('.kl_theme_toggle').length > 0) {
            $('.kl_theme_toggle').click(function () {
                var themeClass = $(this).attr('alt'),
                    themeParts,
                    navFirst = false;
                $('.kl_theme_toggle').css({
                    'border': '',
                    'box-shadow': ''
                });
                $('.kl_theme_toggle[alt="' + themeClass +'"]').css({
                    'border': '1px solid #00dbfd',
                    'box-shadow': '0 0 10px #00dbfd'
                });
                if (themeClass.indexOf('|') > -1) {
                    themeParts = themeClass.split('|');
                    themeClass = themeParts[0];
                    navFirst = true;
                }
                $('#kl_wrapper_3').attr('class', themeClass);
                if (navFirst === true) {
                    $('#kl_navigation').insertAfter('#kl_banner');
                } else {
                    $('#kl_navigation').insertAfter('#kl_banner_image');
                }
                window.scrollTo(0,0);
            });
            $('#kl_banner_left').click(function () {
                var type = $(this).text();
                if (type.indexOf('Design') > -1) {
                    $('.kl_mod_text').text('Objectve ');
                    $('.kl_mod_num').text('1 ');
                } else {
                    $('.kl_mod_text').text('Design ');
                    $('.kl_mod_num').text('Tools ');
                }
            });
        }
    }
},
klPopupLive = {
    tooltipCheck: function () {
        'use strict';
        try {
            if ($('.kl_popup_trigger').length > 0) {
                // $('.kl_tooltip_content').hide();
                if (typeof tippy === 'function') {
                    // spectrumLoaded = true;
                } else {
                    // Tippy 2.3.0
                    $.getScript('https://unpkg.com/tippy.js@3/dist/tippy.all.min.js', function () {
                        console.log("tippy loaded");
                        $('.kl_popup_trigger').each(function(index, el) {
                            var tipContentID = $(this).attr('data-tip-content'),
                                tipContent = $(tipContentID).html(),
                                interactivePopup = true,
                                myID = $(this).attr('id'),
                                tipTheme = 'dark',
                                arrow = true;
                            // if ($(this).hasClass('kl_popup_interactive')) {
                            //     interactivePopup = true;
                            // }
                            if ($(this).hasClass('kl_popover_trigger')) {
                                tipTheme = 'light';
                                $(this).parentsUntil($( ".kl_wrapper" ), 'div').css('overflow', 'visible');
                            }
                            if ($(this).hasClass('kl_modal_trigger')) {
                                tipContentID = $(this).attr('href');
                                tipContent = $(tipContentID).html();
                                tipTheme = 'light';
                                $(this).parentsUntil($( ".kl_wrapper" ), 'div').css('overflow', 'visible');
                                interactivePopup = true;
                                arrow = false;
                            }
                            $(tipContentID).hide();
                            tippy(document.getElementById(myID), {
                                content: tipContent,
                                performance: true,
                                arrow: true,
                                interactive: interactivePopup,
                                autoFocus: false,
                                theme: tipTheme,
                                appendTo: document.getElementById(myID).parentNode,
                                onMount: function(reference) {
                                    document.getElementById(myID).setAttribute('aria-expanded', 'true');
                                },
                                onHide: function(reference) {
                                    document.getElementById(myID).setAttribute('aria-expanded', 'false');
                                },
                                onShow: function(instance) {
                                    document.getElementById(myID).setAttribute('aria-expanded', 'true');
                                    $('#' + instance.popper.id).addClass('kl_wrapper');
                                },
                                onShown: function(instance) {
                                    $('#' + instance.popper.id).addClass('kl_wrapper');
                                }
                            });
                        });
                    });
                }
            }
        } catch (err) {
            klLiveView.errorHandling('Tooltip/Popover', err);
        }

    },
    configure: function () {
        'use strict';
        $('.kl_tooltip_trigger, .kl_popover_trigger').each(function(index, el) {
            var myClasses = $(this).attr('class'),
                myID = $(this).attr('id'),
                targetID = $(this).attr('href'),
                myStyle = $(this).attr('style');
            $(this).replaceWith($('<button id="' + myID + '" class="' + myClasses + '" data-tip-content="' + targetID + '" aria-haspopup="true" aria-expanded="true" style="' + myStyle + '">' + el.innerHTML + '</button>'));
        });
        this.tooltipCheck();
    }
},
klLiveView = {
    errorHandling: function (tag, err) {
        // $('#kl_wrapper_3').prepend('Error: ' + tag + ' ' + err);
        // alert('Error: ' + tag + ' ' + err);
    },
    activeModuleCheck: function () {
        // ACTIVE MODULE CHECK //
        try {
            if ($('#kl_modules').length > 0 && $('.kl_modules_active_start').length > 0 && $('.kl_modules_active_stop').length > 0) {
                var today = new Date();
                $('.kl_connected_module').each(function () {
                    var startDate, endDate;
                    if ($(this).parents('li').find('.kl_modules_active_start').length > 0 && $(this).parents('li').find('.kl_modules_active_stop').length > 0) {
                        startDate = $(this).parents('li').find('.kl_modules_active_start').html();
                        startDate = startDate.replace(' (', '').replace(' to ', '');
                        startDate = new Date(startDate);
                        endDate = $(this).parents('li').find('.kl_modules_active_stop').html();
                        endDate = endDate.replace(')', '');
                        endDate = new Date(endDate + ' 23:59:00');
                        if (today >= startDate && today <= endDate) {
                            $(this).parents('li').addClass('kl_current');
                        }
                    }
                });
            }
        } catch (err) {
            klLiveView.errorHandling('Active Module Check', err);
        }
    },
    sortableTables: function () {
        // MAKE TABLES SORTABLE //
        if ($('.tablesorter').length > 0) {
            $.getScript("https://designtools.ciditools.com/ext/jquery.tablesorter.js", function () {
                $('.tablesorter').tablesorter();
            });
        }
    },
    firstItemLinks: function () {
        // Change module lists that target the first item to point to the module instead
        $('a[href$="/items/first"]').each(function(index, el) {
            var myHref = $(this).attr('href'),
                newHref = myHref.replace('/items/first', '');
            $(this).attr('href', newHref);
        });
    },
    iframeResize: function () {
        $('.kl_iframe_responsive_scale').each(function() {
            // use height and width to get ratio
            var wrapperWidth = $(this).width(),
                $iframe = $(this).find('iframe'),
                actualWidth = $iframe.width(),
                ratio = $iframe.attr('data-ratio'),
                newHeight = (wrapperWidth * parseFloat(ratio));
            // Remove height and width
            $iframe.attr({'height': newHeight, 'width': wrapperWidth});
        });
    },
    iframeConfig: function () {
        // Check for h5p iframes
        if ($('iframe[src*="h5p.org"]').length > 0) {
            $.getScript("https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js", function () {
                console.log('h5p resize js loaded');
            });
            $('iframe[src*="h5p.org"]').each(function() {
                $(this).parents('.kl_iframe_wrapper').contents().unwrap();
            });
        }
        if ($('.kl_iframe_wrapper').length > 0) {
            $('.kl_iframe_wrapper').each(function() {
                // use height and width to get ratio
                var $iframe = $(this).find('iframe'),
                    iframeWidth = $iframe.attr('width'),
                    iframeHeight = $iframe.attr('height'),
                    ratio = iframeHeight / iframeWidth;
                // Remove height and width
                $iframe.attr('data-ratio', ratio);
            });
        }
        klLiveView.iframeResize();
        $(window).resize(function() {
            // Responsive iframe test
            klLiveView.iframeResize();
        });
    },
    pinterestEmbed: function () {
        'use strict';
        // Load Pinterest JS if link detected
        if ($('a[data-pin-do]').length > 0) {
            $.ajax({
              url: 'https://assets.pinterest.com/js/pinit.js',
              dataType: "script"
            });
        }
    },
    magnificLoaded: false,
    imagePopupCheck: function () {
        'use strict';
        try {
            if ($('.kl_popup_image, .kl_popup_gallery').length > 0) {
                if (klLiveView.magnificLoaded) {
                    klLiveView.createImagePopups();
                } else {
                    if ($('.kl_popup_image, .kl_popup_gallery').length > 0) {
                        $('head').append('<link rel="stylesheet" href="https://files.ciditools.com/plugins/magnific-popup/magnific-popup.css" type="text/css" />');
                        $.getScript("https://files.ciditools.com/plugins/magnific-popup/jquery.magnific-popup.js", function () {
                            klLiveView.magnificLoaded = true;
                            klLiveView.createImagePopups();
                        });
                    }
                }
            }
        } catch (err) {
            klLiveView.errorHandling('Image Popups Check', err);
        }
    },
    createImagePopups: function () {
        'use strict';
        try {
            // Image Gallery
            $('.kl_popup_image, .kl_popup_gallery img').each(function() {
                var imageSrc = $(this).attr('src'),
                    imageTitle = $(this).attr('alt'),
                    caption = '';
                if ($(this).parents('figure').length > 0) {
                    imageTitle = $(this).parents('figure').find('figcaption').text();
                }
                if ($(this).attr('title') !== undefined) {
                    imageTitle = $(this).attr('title');
                }
                if (imageTitle === undefined) {
                    imageTitle = '';
                }
                $(this).wrap('<a class="kl_gallery_image_link" href="' + imageSrc + '" title="' + imageTitle + '"></a>');
            });
            $('.kl_popup_gallery .kl_popup_image').each(function() {
                $(this).removeClass('kl_popup_image');
            });
            $('.kl_popup_gallery').each(function(item) {
                $(this).magnificPopup({
                    delegate: 'a.kl_gallery_image_link', // the selector for gallery item
                    type: 'image',
                    titleSrc: 'title',
                    gallery: {
                      enabled:true
                    }
                });
            });
            // Single Images
            $('.kl_popup_image').closest('a').addClass('kl_popup_single');
            $('.kl_popup_single').magnificPopup({
                titleSrc: 'title',
                type: 'image'
            });
        } catch (err) {
            klLiveView.errorHandling('Create Image Popups', err);
        }
    }
};

function quickCheckSetup() {
    // QUICK CHECK //
    if ($(".kl_quick_check").length > 0) {
        // Run some functions
        $(".kl_quick_check").each(function (j) {
            var quickCheckSection = $(this).attr("id");
            // add radio checkbox before each answer
            $("#" + quickCheckSection + " .kl_quick_check_answer_wrapper").each(function (i) {
                $(this).find(".kl_quick_check_answer").prepend('<input class="kl_quick_check_field" type="radio" name="kl_quick_check_' + j +
                    '" value="false" rel="#' + quickCheckSection + ' #kl_quick_check_response_' + i + '"> ').wrap("<label />");
                $(this).find(".kl_quick_check_response").attr("id", "kl_quick_check_response_" + i);
            });
            $("#" + quickCheckSection + " .kl_quick_check_response").each(function () {
                $(this).hide().addClass("kl_quick_check_incorrect");
            });
            $("#" + quickCheckSection + " .kl_quick_check_correct_answer .kl_quick_check_response").removeClass("kl_quick_check_incorrect").addClass("kl_quick_check_correct");
            $("#" + quickCheckSection + " .kl_quick_check_correct_answer .kl_quick_check_field").attr("value", "true");
            $("#" + quickCheckSection + " .kl_quick_check_field").click(function () {
                try {
                    var showResponse,
                    selected = $("input[type='radio'][name='kl_quick_check_" + j + "']:checked");
                    $("#" + quickCheckSection + " .kl_quick_check_response").hide().appendTo("#" + quickCheckSection + " .kl_quick_check");
                    showResponse = $("#" + quickCheckSection + " input[type='radio'][name='kl_quick_check_" + j + "']:checked").attr("rel");
                    $(showResponse).show();
                    // alert(showResponse);
                } catch (qcErr) {
                    // alert(qcErr);
                }
            });
        });
        // Add Visual indication of which is correct besides color
        $('.kl_quick_check_incorrect').prepend('<div class="kl_quick_check_answer_type"><i class="icon-x"></i><span class="screenreader-only">Incorrect</span></div>');
        $('.kl_quick_check_correct').prepend('<div class="kl_quick_check_answer_type"><i class="icon-check"></i><span class="screenreader-only">Correct</span></div>');
        // If required, hide next link and add message
        if ($('.kl_quick_check_required').length > 0) {
            $("a:contains('Next')").hide();
            $("a:contains('Next')").before('<div id="kl_next_hidden" class="pull-right"><i class="icon-warning"></i> Answer Quick Checks to proceed</div>');
            $(".kl_quick_check_field").change(function () {
                var numberNeeded = $(".kl_quick_check_required").length,
                numberAnswered = $(".kl_quick_check_correct:visible").length;
                if (numberNeeded === numberAnswered) {
                    $("a:contains('Next')").show();
                    $("#kl_next_hidden").hide();
                } else {
                    $("a:contains('Next')").hide();
                    $("#kl_next_hidden").show();
                }
            });
        }
    }
}
(function () {
    function loadScript(url, callback) {
        try {
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                script.onload = function () {
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        } catch (err) {
            // alert(err);
        }

    }
    if (document.contains(document.getElementById("kl_wrapper_3")) && !document.getElementsByTagName("body")[0].classList.contains('using_design_tools')) {
        loadScript("https://code.jquery.com/jquery-1.9.1.min.js", function () {
            loadScript("https://code.jquery.com/ui/1.11.3/jquery-ui.min.js", function () {
                $.ajaxSetup({
                  cache: true
                });
                //jQuery and jQuery UI loaded
                if (!$('body').hasClass('kl_app_css') && !$('body').hasClass('using_design_tools')) {
                    // FA4 to FA5 Icon Update
                    if ($('.fa').length > 0) {
                        $.getScript("https://designtools.ciditools.com/js/util/fa5update.js", function () {
                            console.log("Update FA5 icons");
                        });
                    }
                    if ($('#kl_wrapper_3').length > 0) {
                        // Design Tools specific
                        $('#kl_wrapper_3').addClass('kl_wrapper');
                        quickCheckSetup();
                        setTimeout(function () {
                            klPanelsLive.configure();
                            // alert('configured');
                        }, 1000);
                        klPopupLive.configure();
                        $('body').addClass('kl_app_css');
                        testing.themeToggle();
                        // Dated current Module
                        klLiveView.activeModuleCheck();
                        // Sortable Tables
                        klLiveView.sortableTables();
                        // Clean up module list
                        klLiveView.firstItemLinks();
                        // Look for responsive iframes
                        klLiveView.iframeConfig();
                        // Look for Pinterest links
                        klLiveView.pinterestEmbed();
                        // Image/gallery popups
                        klLiveView.imagePopupCheck();
                        // Remove margins/padding from container if Design Tools was used
                        $('body').addClass('kl_tools_used');
                        // Show Title if Design Tools title is missing
                        if ($('.kl_show_title').length > 0 || $('#kl_wrapper_3 #kl_banner h2').length === 0) {
                            $('h1#title').show();
                        }
                        // Clean up Canvas styles
                        var style = $('style').first().text();
                        style = style.split('color: #444;').join('');
                        style = style.split('font-family: Helvetica;').join('');
                        style = style.split('font-weight: 100;').join('');
                        $('style').first().remove();
                        $('head').prepend('<style>' + style + '</style>');
                        // Max width fill class
                        $('.kl_image_max_fill').css('max-width', '100%');
                        // setTimeout(function () {
                        //     // Code here
                        //     testing.consoleTextArea();
                        // }, 1000);
                    }
                }
            });
        });
    }


})();