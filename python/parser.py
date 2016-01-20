# -*- coding: utf-8 -*-

import datetime
import xlrd

import json

year = 2016

#Функция возвращает верхняя или нижняя неделя у принятой даты
def week_even(year, month, day):
    return [u'В', u'Н'][datetime.date(year, month, day).isocalendar()[1] % 2]

def parse(xls_file_data):
    # список всех учебных занятий
    lessons_list = []

    rb = xlrd.open_workbook(file_contents=xls_file_data.read())

    if xls_file_data.info().getheader('Content-Type') != 'application/vnd.ms-excel':
        print 'error'
        return

    for sheet_number in range(0, rb.nsheets):
        if sheet_number == 1:
            continue
        sheet = rb.sheet_by_index(sheet_number)
        rows = []
        row_number = 0
        for row_number in range(sheet.nrows):  # считываем строки Excel файла
            rows.append(sheet.row_values(row_number))
        #return rows
        # подготавливаем к записи в БД
        for i in range(1, row_number):
            # ищем занятия
            if rows[i - 1][0] != '':
                number = int(rows[i - 1][0])   # номер пары
            if rows[i][2] == u'Лекция' or rows[i][2] == u'Пр.Зан.' or rows[i][2] == u'Лаб.раб.' or rows[i][2] == u'Семинар':
                if rows[i - 1][0] != '':
                    number = int(rows[i - 1][0])   # номер пары
                    week = rows[i - 1][1]
                if rows[i - 1][1] != '':
                    week = rows[i - 1][1]     # день недели
                lesson_type = rows[i][2]  # тип пары
                teacher = rows[i][4]     # преподаватель
                auditory = rows[i][6]    # аудитория
                subject = rows[i - 1][2]  # название предмета
                days_string = rows[i + 1][2]  # строка дни проведения занятий
                days = []  # массив с днями проведения занятий
                excluded = []  # временный массив для хранения исключаемых занятий
                # ищем дни проведения
                # когда есть пары "только"
                if days_string.find(u'только') != -1:
                    for j in range(6, len(days_string)):
                        if days_string[j] == u'.':
                            d = days_string[j - 2: j + 3]
                            days.append(datetime.date(year, int(d[3:5]), int(d[0:2])))
                else:
                    # когда есть "с xx.xx по xx.xx"
                    frm = days_string.find(u'с ')
                    if frm != -1:
                        begin = days_string[frm + 2:frm + 7]  # начало периода пар
                        datebegin = datetime.date(year, int(begin[3:5]), int(begin[0:2]))  # приводим к формату даты
                        end = days_string[frm + 11:frm + 16]  # конец периода
                        dateend = datetime.date(year, int(end[3:5]), int(end[0:2]))
                        exclude = days_string.find(u'кроме ')
                        if exclude != -1:   # если есть слово "кроме" в строке
                            for j in range(exclude + 6, len(days_string)):
                                if days_string[j] == u'.':
                                    e = days_string[j - 2: j + 3]
                                    ex = datetime.date(year, int(e[3:5]), int(e[0:2]))
                                    excluded.append(ex)
                                    # вычисляем шаг проведения пар (7 или 14 дней)
                        if week == '':  # если чётность недели пустая - пара на каждой неделе
                            step = 7
                            d = datebegin
                        else:
                            step = 14
                            if week_even(year, int(begin[3:5]), int(begin[0:2])) == week:
                                d = datebegin
                            else:
                                d = datebegin + datetime.timedelta(days=7)
                        # записываем все дни в список дней
                        while d <= dateend:
                            days.append(d)
                            d += datetime.timedelta(days=step)
                            # исключаем дни из списка "кроме"
                        for e in excluded:
                            for ds in days:
                                if e == ds:
                                    days.remove(ds)
                lessons_list.extend(
                    write_lesson(lesson_type, subject, teacher, days, number, auditory, sheet_number)
                )
    return lessons_list

def write_lesson(lesson_type, subject, teacher, days, number, auditory, sheet_number):
    lessons_list = []
    if sheet_number == 0:
        sub_group = 0
    else:
        sub_group = sheet_number - 1


    #Добавляем в список всех занятий новые
    for day in days:
        lessons_list.append({
            'number': number,
            'date': str(day),
            'subject': subject,
            'teacher': teacher,
            'lesson_type': lesson_type,
            'sub_group': sub_group,
            'auditory': auditory,
        })
    return lessons_list
