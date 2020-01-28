jQuery(document).ready(function($) {

    console.log('calendar.js');

    // global vars
    var $c       = $('.mini-calendar-biocat .view-header');
    var lang     = $('html').attr('lang');
    var yi       = 2016; // year ini
    var ye       = 2022; // year end
    var currDate = new Date(); // current date
    var isDay    = false;
    var href     = window.location.href;
    var dtc, dtb, dc, db, mc, mb, yc, yb, dl, ml, yl; // date total calendar, date total body, day current, day predefined, month current, month predefined, year current, day limit, month limit, year limit
    var dateUrl, term
    var dateArr = []

    // ini
    function __ini() {
        if (!$('.mini-calendar-biocat .view-header').length) return
        __getUrlDate();      
        __getLastDate();        
        __createSelect();
        __disableDays();
        __toggleNextPrev();
    }
    __ini();
    

    // bts

    // body pagination
    $('.main-container .region-content .view-agenda .view-header .pagination a').click(function(e) {
        e.preventDefault()
        $(this).parent('.prev').length ? $c.find('.pagination li.prev a').trigger('click') : $c.find('.pagination li.next a').trigger('click')
    });

    // select
    $c.find('select.month, select.year').change(function(e) {
        __openSelectedYearMonth('select')
    });

    // arrows
    $c.find('.pagination a').click(function(e) { // paginador next prev
        e.preventDefault()
        var $t    = $(this)
        var month = parseInt($c.find('select.month').val())
        var year  = parseInt($c.find('select.year').val())

        if ($t.parent('.prev').length) {
            month == '01'? (year = year - 1, month = '12') : month = month - 1;
        }

        if ($t.parent('.next').length) {
            month == '12'? (year = year + 1, month = '01') : month = month + 1;
        }

        month = ('0' + month).slice(-2) // afegeix 0 davant del número si ho necessita

        __openSelectedYearMonth('arrow', month, year)
    });

    // day calendar
    $('section[id*=block-views-agenda-mini-calendar] .view-agenda td.has-events a').click(function(e) {
        e.preventDefault()
        __openSelectedDay($(this))
    });

    // Recull data de l'url del browser
    function __getUrlDate() {
        var m   = lang == 'ca' ? 'mes' : lang == 'es' ? 'mes' : 'month'
        var d   = lang == 'ca' ? 'dia' : lang == 'es' ? 'dia' : 'day'
        var pt  = window.location.pathname
        var arr = pt.split('/')
        isDay   = $.inArray(d,arr) > -1 ? true : false // detacte si a la url està el terme de 'dia'
        term    = isDay ? d : m
        
        if (href.split(term)[1] == 0) { // si només tenim posat dia o mes sense data afegim el current data
            dateArr.push(currDate.getFullYear())
            dateArr.push(('0'+ (currDate.getMonth() + 1)).slice(-2)) // afegeix 0 al mes si ho necessita
            dateArr.push(currDate.getDate())
        }
        else {
            dateUrl = (((href.split(term)[1]).split('/'))[1].split('?')[0]) // escolleix data de la url després del terme mes o dia     
            dateArr = dateUrl.split('-') // Afegeix a l'array la data separada pels guions
        }

        //console.log(dateArr)               
    }

    // Selecciona dia
    function __openSelectedDay($t) {
        var mLang   = lang == 'ca' ? 'mes' : lang == 'es' ? 'mes' : 'month'
        var dayLang = lang == 'ca' ? 'dia' : lang == 'es' ? 'dia' : 'day'
        var dom     = isDay ? dayLang : mLang // si a la url està predefinit dia o no
        var path    = (window.location.href).split(dom)[0] // agafa tot lo primer d'url abans del nom dia o mes

        var href = $t.attr('href')
        var date = (((href.split(dayLang)[1]).split('/'))[1].split('?')[0]) // escolleix data de la url després del terme mes o dia     
        var dateMini = date.split('-')
            dateMini.pop() // esborra últim ítem array que correspon al dia
            dateMini = dateMini[0] +'-'+ dateMini[1]
        var url = path + dayLang +'/'+ date +'?mini='+ dateMini 
        window.open(url, '_self')
    }

    // Recolleix data final límit
    function __getLastDate() {
        var end = $('.mini-calendar-biocat .date-display-single').text().replace(/[^\d/]/g,"").split('/');
        dl      = end[0];
        ml      = end[1];
        yl      = currDate.getFullYear(); // year limit = current year
    }

    // crea els dos selects de mesos-anys i es afegeix valors
    function __createSelect() {
        // crea selects treient selecció d'any i mes       
        $c.append('<div class="wrapper-date"><select class="month" dir="rtl"></select></div><div class="wrapper-date"><select class="year" dir="rtl"></select></div>');
        var $mo = $c.find('select.month');
        var $ye = $c.find('select.year');
   
        // popula mesos
        var mCa  = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
        var mEs  = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        var mEn  = ['january', 'february', 'march ', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        var m = lang == 'ca' ? mCa : lang == 'es' ? mEs : mEn;

        $.each(m, function(i,o) {
            var val = ('0'+ (i + 1)).slice(-2); // afegeix 0 si és número d'un dígit
            $mo.append('<option value="'+ val +'">'+ m[i] +'</option>');
        });

        // popula anys
        var y = [];
        for (var i = yi; i <= ye; i++) y.push(i);
        $.each(y, function(i,o) {
            $c.find('select.year').append('<option value="'+ y[i] +'">'+ y[i] +'</option>');
        });

        // afegeix data predefinida a la url
        $c.find('select.month').val(dateArr[1])
        $c.find('select.year').val(dateArr[0])
    }

    // Obre amb mes i any actius del select
    function __openSelectedYearMonth(tipus, month, year) {
        var mLang   = lang == 'ca' ? 'mes' : lang == 'es' ? 'mes' : 'month'
        var dayLang = lang == 'ca' ? 'dia' : lang == 'es' ? 'dia' : 'day'
        var dom     = isDay ? dayLang : mLang // si a la url està predefinit dia o no
        var path    = (window.location.href).split(dom)[0] // agafa tot lo primer d'url abans del nom dia o mes
        var date = tipus == 'arrow' ? year + '-' + month : $c.find('select.year').val() + '-' + $c.find('select.month').val()
        var url  = path + mLang +'/'+ date +'?mini='+ date

        window.open(url, '_self');
    }

    // Desactiva dies sense activitats compresos en el mes i any predefinits com a límit
    function __disableDays() {
        if (yc != yl || mc != ml) return;
        for (var i = 16; i <= 31; i++) $('.mini-calendar-biocat').find('#agenda-'+ yl + '-'+ ml +'-'+ i +'> div').css('visibility','hidden');       
    }

    // Activa i desactiva fletxes anterior i següent segons si ens trobem en el límit
    function __toggleNextPrev() {
        if (yc == yl && mc >= ml) $('.mini-calendar-biocat .view-header .next').hide();
        if (yc == yi && mc == '00') $('.mini-calendar-biocat .view-header .prev').hide();
    }
});;