from flask import Flask, send_file, render_template, request, abort, session
import sqlite3
import time
from werkzeug.utils import secure_filename
import uuid
import json
import html

con = sqlite3.connect('./data.db', check_same_thread=False)
cur = con.cursor()

#import os
#os.makedirs(image_path, exist_ok=True)

cur.execute('create table if not exists projects (id real, category real, title text, author text, html text, time real, edited text, img text,del real )')
cur.execute('create table if not exists timeline (id real, text text, author text, time_text real, time real, edited real)')
cur.execute('create table if not exists team (id real, name text, joined real, text text, edited text, img text, pw real)')
cur.execute('create table if not exists admin (id real, joined real)')
cur.execute('create table if not exists files (id real, type text, name text, link text, author text, time real)')
cur.execute('create table if not exists popup (id real, title text, time real, author text, html text, edited real, end real)')
cur.execute('create table if not exists category (id real, title text, dec text, time real, author text, edited text,color text)')

cur.execute('create table if not exists edit_projects (id real, target_id text, category real, title text, author text, html text, time real, img text, edited text)')
cur.execute('create table if not exists edit_team (id real, name text, joined real, text text, edited text, img text)')
cur.execute('create table if not exists edit_category (id real, target_id text, title text, dec text, time real, author text, edited text,color text)')
cur.close()
con.close()

app = Flask(__name__)
app.secret_key = 'Secret Key'

@app.route('/file/<path:path>')
def file(path):
    return send_file(f'./file/{path}')
@app.route('/file/s/<path:path>')
def file_static(path:str):
    path = path.replace('/','\\')
    return send_file(f'C:\\Users\\SEON\\PycharmProjects\\T.F_LAB_WEB\\static\\{path}')

@app.route('/projects')
def projects():
    con = sqlite3.connect('./data.db', check_same_thread=False)
    cur = con.cursor()

    projects = cur.execute('select id, title, author, time, img from projects order by id desc').fetchall()
    len_ = len(projects)

    cur.close()
    con.close()

    return render_template('./projects.html', projects=projects, int=int, len=len_)

@app.route('/project')
def project_edit_view():
    id_ = request.args.get('edit')
    if id_ != None:
        con = sqlite3.connect('./data.db', check_same_thread=False)
        cur = con.cursor()
        pj = cur.execute(f'select title, html from edit_projects where id="{id_}" and author="{session.get('user')}"').fetchone()
        if pj == None: abort(404)
        title, html_ = pj
        html_ = html.unescape(html_)
        cur.close()
        con.close()
        return render_template('project.html', title=title, html=html_, edited=1, author=session.get('user'))
@app.route('/project/<int:id>')
def project(id:int):
    con = sqlite3.connect('./data.db', check_same_thread=False)
    cur = con.cursor()
    try:
        print(request.args.get('edit'))
        if request.args.get('get')=='html':
            return json.dumps(html.unescape(cur.execute(f'select html from projects where id={id}').fetchone()))
    except: pass
    try:
        title, author, html_, edited = cur.execute(f'select title,author, html, edited from projects where id={id}').fetchone()
        html_ = html.unescape(html_)
        print('"'+html_+'"')
        author = cur.execute(f'select id, name from team where id={author}').fetchone()
        author = (int(author[0]),author[1])
    except Exception as e:
        print(e)
        abort(404)

    cur.close()
    con.close()

    return render_template('project.html',title=title,edited=edited,author=author, html=html_)

@app.route('/member')
def members():
    return render_template('./members.html')

@app.route('/member/<int:id>')
def member_(id:int):
    con = sqlite3.connect('./data.db', check_same_thread=False)
    cur = con.cursor()
    member = cur.execute(f'select id, name, joined, text, edited, img from team where id={id}').fetchone()
    cur.close()
    con.close()
    return render_template('./member.html',member=member,int=int,str=str)

@app.route('/member/<string:id>')
def member__(id:str):
    con = sqlite3.connect('./data.db', check_same_thread=False)
    cur = con.cursor()
    member = cur.execute(f'select id, name, joined, text, edited, img from team where name="{id}"').fetchone()
    cur.close()
    con.close()
    return render_template('./member.html',member=member,int=int,str=str)

@app.route('/upload')
def upload_():
    if session.get('user') == None: abort(404)
    return render_template('./upload_select.html')

@app.route('/upload/file', methods=['GET','POST'])
def upload_file():
    if session.get('user') == None: abort(404)
    if request.method == 'GET':
        abort(404)

    elif request.method == 'POST':
        files = request.files.getlist('upload')
        for file in files:
            file_name = file.filename
            type_ = file.mimetype.split('/')[0]
            id_ = str(uuid.uuid4())
            # (id real, type text, name text, link text, author text, time real)
            fn = secure_filename(id_)+ '.' + file_name.split('.')[-1]
            path = './file/uploads/' + fn
            file.save(path)

            author = session.get('user')  # cur.execute(f'select name from team where id={session.get('user')}')
            con = sqlite3.connect('./data.db', check_same_thread=False)
            cur = con.cursor()
            cur.execute(
                f'insert into files values ("{id_}","{type_}","{file.filename}","/file/uploads/{fn}","{author}",{time.time()})')
            con.commit()
            cur.close()
            con.close()

        return 'arlet("Upload End");'


    else: abort(404)

@app.route('/upload/get/<string:get>')
def upload_get(get):
    con = sqlite3.connect('./data.db', check_same_thread=False)
    cur = con.cursor()
    if get == 'time':
        time_ = request.args.get('time')
        format = request.args.get('format')
        result = time.strftime(str(format), time.localtime(float(time_)))
        cur.close()
        con.close()
        return json.dumps(result)
    elif get == 'categories':
        categories = cur.execute(f'select * from category').fetchall()
        cur.close()
        con.close()
        return json.dumps(categories)
    elif get == 'category':
        id_ = request.args.get('id')
        category = cur.execute(f'select * from category where id={id_}').fetchone()
        cur.close()
        con.close()
        return json.dumps(category)
    elif get == 'author':
        id_ = request.args.get('id')
        data = cur.execute(f'select id, name from team where id={id_}').fetchone()
        cur.close()
        con.close()
        return json.dumps(data)
    else:
        if session.get('user') == None: abort(404)
        if get == 'files':
            files = cur.execute(f'select * from files where author={session.get('user')}').fetchall()
            cur.close()
            con.close()
            return json.dumps(files)
        else: abort(404)

@app.route('/upload/<string:type_>', methods=['GET', 'POST'])
def upload__(type_):
    if session.get('user') == None: abort(404)
    if request.method == 'GET':

        if type_ == 'project':
            edit = request.args.get('edit')
            if edit == None:
                edit = False
                msg={}
            else:
                #(id real, category real, title text, author text, html text, time real, edited real, img text, del real)
                con = sqlite3.connect('./data.db', check_same_thread=False)
                cur = con.cursor()
                id_, category, title, author, html_, time_, edited, img, del_ = cur.execute(f'select * from projects where id={edit}').fetchone()
                msg = {
                    'id': id_,
                    'category': category,
                    'title': title,
                    'author': author,
                    'html': html_,
                    'img': img
                }
                edit = True
                cur.close()
                con.close()
            return render_template('upload_project.html', edit=edit, msg=msg)
        elif type_ == 'categories':
            con = sqlite3.connect('./data.db', check_same_thread=False)
            cur = con.cursor()
            categories = cur.execute('select * from category').fetchall()
            no = False
            if len(categories) <= 0: no = True
            cur.close()
            con.close()
            return render_template('upload_categories.html', categories=categories,no=no)
        elif type_ == 'member':
            return render_template('upload_member.html')
        elif type_ == 'edit_project':
            if request.args.get('id') == None:
                con = sqlite3.connect('./data.db', check_same_thread=False)
                cur = con.cursor()
                projects = cur.execute(f'select id, title, author, time, img from projects where author={session.get('user')} order by time desc').fetchall()
                len_ = len(projects)
                cur.close()
                con.close()
                return render_template('upload_project_edit.html', projects=projects, int=int, len=len_, title=None)
            else:
                con = sqlite3.connect('./data.db', check_same_thread=False)
                cur = con.cursor()
                _id = request.args.get('id')
                title = cur.execute(f'select title from projects where id={_id}').fetchone()
                projects = cur.execute(f'select id, title, category, img, time from edit_projects where target_id = {_id} order by time desc').fetchall()
                print(projects)
                cur.close()
                con.close()
                return render_template('upload_project_edit_list.html',projects=projects, len=len(projects), title=title[0])
        elif type_ == 'password':
            return render_template('upload_password.html')
        elif type_ == 'files':
            return render_template('upload_files.html')

        else: abort(404)
    elif request.method == 'POST':
        con = sqlite3.connect('./data.db', check_same_thread=False)
        cur = con.cursor()
        if type_ == 'project':
            data = request.json
            title = data['title']
            html_ = html.escape(str(data['html']))
            src = data['src']
            edit = data['edit']
            category = data['category']
            #(id real, category real, title text, author text, html text, time real, edited real, img text,del real )
            if edit == 0:
                _id = cur.execute("SELECT COUNT() FROM projects").fetchone()[0]+1
                print(f'({_id}, {category}, "{title}", "{session.get('user')}", "{html_}", {time.time()}, 0, "{src}", 0)')
                cur.execute(f'insert into projects values ({_id}, {category}, "{title}", "{session.get('user')}", "{html_}", {time.time()}, 0, "{src}", 0)')
                con.commit()
            else:
                _id = data['id']

                original = cur.execute(f'select * from projects where id={_id}').fetchone()
                #edit_projects (id real, category real, title text, author text, html text, time real, img text)
                id_ = str(uuid.uuid4())
                cur.execute(f'insert into edit_projects values ("{id_}",{_id}, {original[1]},"{original[2]}", "{original[3]}", "{original[4]}",{time.time()},"{original[7]}", "{original[6]}")')
                cur.execute(f'update projects set edited="{id_}", title="{title}", img="{src}", category={category}, html="{html_}" where id={_id}')
                con.commit()
            cur.close()
            con.close()
            return ''
        elif type_ == 'password':
            now = int(request.form.get('now_pw'))
            pw = int(request.form.get('pw'))
            re = int(request.form.get('re_pw'))

            user = int(cur.execute(f'select pw from team where id={session.get('user')}').fetchone()[0])
            cur.close()
            con.close()
            if user != None:
                if now == user:
                    if pw == re:
                        con = sqlite3.connect('./data.db', check_same_thread=False)
                        cur = con.cursor()
                        cur.execute(f'update team set pw={pw} where id={session.get('user')}')
                        con.commit()
                        session.pop('user',None)
                        cur.close()
                        con.close()
                        return '<script>alert("비밀번호를 변경했습니다. 다시 로그인 해주세요."); location.href="/login";</script>'
                    else: return '<script>alert("비밀번호를 확인하세요"); location.href="";</script>'
                else: return '<script>alert("비밀번호를 확인하세요"); location.href="";</script>'
            else: return '<script>alert("비밀번호를 확인하세요"); location.href="";</script>'
        elif type_ == 'categories':

            print(request.json)
            data = request.json
            edit = data['edit']
            title = data['title']
            color = data['color']
            for i,v in enumerate(color):
                color[i] = int(v)
            dec = data['dec']

            if edit == 0:
                pass
            else:
                # (id real, title text, dec text, time real, author text, edited real,color text)
                title_, dec_, author_, color_, edited_ = cur.execute(
                    f'select title, dec, author, color, edited from category where id={edit}').fetchone()
                id_ = str(uuid.uuid4())
                cur.execute(
                    f'insert into edit_category values ("{id_}", {edit}, "{title_}", "{dec_}", {time.time()}, {author_}, "{edited_}", "{color_}")')
                cur.execute(f'update category set title="{title}",dec="{dec}",color="{color}",edited="{id_}" where id={edit}')
                con.commit()

                return 'UPDATE'
        elif type_ == 'member':
            #id real, name text, joined real, text text, edited text, img text, pw real
            name = request.form.get('name')
            text = request.form.get('text')
            id_ = cur.execute("SELECT COUNT() FROM team").fetchone()[0]+1
            cur.execute(f'insert into team values ("{id_}","{name}",{time.time()},"{text}","0","","1234")')
            con.commit()
            cur.close()
            con.close()
            return f'<script>location.href="/member/{id_}";</script>'

        else: abort(404)

    else: abort(404)

@app.route('/')
def main():
    con = sqlite3.connect('./data.db', check_same_thread=False)
    cur = con.cursor()
    projects = cur.execute('select id, title, author, img, time, edited from projects order by id desc').fetchmany(10)
    timeline = cur.execute('select id, text, time_text from timeline order by time_text asc').fetchall()

    teams = cur.execute('select id, name, img from team').fetchall()

    cur.close()
    con.close()

    return render_template('mainmenu.html',
                           projects=projects,
                           members=teams,
                           timeline=timeline,
                           int=int,
                           pl=len(projects),
                           user=session.get('user')
                           )

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        id_ = request.form.get('id')
        pw_ = request.form.get('pw')
        con = sqlite3.connect('./data.db', check_same_thread=False)
        cur = con.cursor()
        _id = cur.execute(f'select id from team where name="{id_}" and pw="{pw_}"').fetchone()
        if _id == None:
            return '<script>alert("아이디 및 비밀번호를 확인하세요."); location.href="";</script>'
        session['user'] = _id[0]
        cur.close()
        con.close()
        return '<script>location.href="/";</script>'
    else: abort(404)

@app.route('/logout')
def logout():
    session.pop('user',None)
    return '<script>location.href="/"</script>'

@app.errorhandler(404)
def error_404(e):
    return render_template('error.html', type = 404, msg=e)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)
